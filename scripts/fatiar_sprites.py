#!/usr/bin/env python
"""
Fatia uma folha de sprites gerada por IA em PNGs individuais com alpha.

Por que deteccao em vez de grade fixa: gerador de imagem NAO respeita grade
matematica. As celulas saem tortas, com tamanhos diferentes e espacamento
irregular. Cortar em coordenadas fixas decepa metade dos desenhos. Entao aqui
a gente acha cada figura pelos pixels dela.

Fluxo:
    1. remove o fundo por preenchimento a partir das bordas
       (branco no meio do desenho fica, porque nao encosta na borda)
    2. dilata a mascara para juntar partes soltas da mesma figura
    3. rotula os componentes conectados
    4. ordena em ordem de leitura (linha por linha, esquerda para direita)
    5. recorta, apara, redimensiona e salva

Uso:
    python scripts/fatiar_sprites.py folha.png \
        --saida src/assets/library/higiene \
        --nomes sabonete,chuveiro,escova-de-dentes \
        --tamanho 256

    # so inspecionar a ordem antes de gravar:
    python scripts/fatiar_sprites.py folha.png --conferir
"""

from __future__ import annotations

import argparse
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


# --------------------------------------------------------------------- fundo

def mascara_do_conteudo(arr: np.ndarray, tolerancia: int) -> np.ndarray:
    """True onde ha desenho. False no fundo."""
    alt, larg = arr.shape[:2]

    # Se a folha ja veio com transparencia de verdade, e so usar o alpha.
    alpha = arr[:, :, 3]
    if (alpha < 250).sum() > 0.05 * alt * larg:
        return alpha > 40

    # Senao: preenchimento a partir das bordas. Isso e o que preserva branco
    # DENTRO do desenho (olho, dente, reflexo) — ele nao encosta na borda.
    rgb = arr[:, :, :3].astype(np.int16)
    cantos = np.array([rgb[0, 0], rgb[0, -1], rgb[-1, 0], rgb[-1, -1]])
    fundo = np.median(cantos, axis=0)

    parecido = (np.abs(rgb - fundo).max(axis=2) <= tolerancia)

    visitado = np.zeros((alt, larg), dtype=bool)
    fila: deque[tuple[int, int]] = deque()

    for x in range(larg):
        for y in (0, alt - 1):
            if parecido[y, x] and not visitado[y, x]:
                visitado[y, x] = True
                fila.append((y, x))
    for y in range(alt):
        for x in (0, larg - 1):
            if parecido[y, x] and not visitado[y, x]:
                visitado[y, x] = True
                fila.append((y, x))

    while fila:
        y, x = fila.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < alt and 0 <= nx < larg and parecido[ny, nx] and not visitado[ny, nx]:
                visitado[ny, nx] = True
                fila.append((ny, nx))

    return ~visitado


def dilatar(mascara: np.ndarray, raio: int) -> np.ndarray:
    """Engorda a mascara para unir partes soltas da mesma figura."""
    saida = mascara.copy()
    for _ in range(raio):
        d = saida.copy()
        d[1:, :] |= saida[:-1, :]
        d[:-1, :] |= saida[1:, :]
        d[:, 1:] |= saida[:, :-1]
        d[:, :-1] |= saida[:, 1:]
        saida = d
    return saida


# ---------------------------------------------------------------- componentes

def componentes(mascara: np.ndarray) -> list[tuple[int, int, int, int]]:
    """Caixas (x0, y0, x1, y1) de cada regiao conectada."""
    alt, larg = mascara.shape
    visitado = np.zeros((alt, larg), dtype=bool)
    caixas = []

    for y0 in range(alt):
        linha = mascara[y0]
        for x0 in np.nonzero(linha & ~visitado[y0])[0]:
            fila = deque([(y0, int(x0))])
            visitado[y0, x0] = True
            minx = maxx = int(x0)
            miny = maxy = y0

            while fila:
                y, x = fila.popleft()
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < alt and 0 <= nx < larg and mascara[ny, nx] and not visitado[ny, nx]:
                        visitado[ny, nx] = True
                        fila.append((ny, nx))

            caixas.append((minx, miny, maxx + 1, maxy + 1))

    return caixas


def caixas_por_grade(mascara: np.ndarray, colunas: int, linhas: int):
    """Uma caixa por celula de uma grade regular.

    Quando a folha ja vem numa grade — as vezes o gerador ate desenha as
    linhas —, dividir e pegar todo o conteudo de cada celula e melhor que
    detectar componente: nao ha o que adivinhar. Resolve o caso classico da
    peca solta dentro da celula (a bola de golfe longe do golfista, a seta
    ao lado da cabeca) que a deteccao separaria em duas figuras.
    """
    alt, larg = mascara.shape
    passo_x, passo_y = larg / colunas, alt / linhas
    caixas = []

    for linha in range(linhas):
        for coluna in range(colunas):
            x0, x1 = round(coluna * passo_x), round((coluna + 1) * passo_x)
            y0, y1 = round(linha * passo_y), round((linha + 1) * passo_y)
            celula = mascara[y0:y1, x0:x1]

            cheias_y = np.nonzero(celula.any(axis=1))[0]
            cheias_x = np.nonzero(celula.any(axis=0))[0]
            if cheias_y.size == 0 or cheias_x.size == 0:
                continue  # celula vazia: a grade tinha mais lugares que figuras

            caixas.append((
                x0 + int(cheias_x[0]), y0 + int(cheias_y[0]),
                x0 + int(cheias_x[-1]) + 1, y0 + int(cheias_y[-1]) + 1,
            ))

    return caixas


def ordem_de_leitura(caixas: list[tuple[int, int, int, int]]) -> list[tuple[int, int, int, int]]:
    """Agrupa em linhas e ordena esquerda->direita. Grade torta nao atrapalha."""
    if not caixas:
        return []

    alturas = [c[3] - c[1] for c in caixas]
    limite = np.median(alturas) * 0.6

    restantes = sorted(caixas, key=lambda c: c[1])
    linhas: list[list] = []

    for caixa in restantes:
        centro = (caixa[1] + caixa[3]) / 2
        for linha in linhas:
            ref = np.mean([(c[1] + c[3]) / 2 for c in linha])
            if abs(centro - ref) <= limite:
                linha.append(caixa)
                break
        else:
            linhas.append([caixa])

    saida = []
    for linha in linhas:
        saida.extend(sorted(linha, key=lambda c: c[0]))
    return saida


# -------------------------------------------------------------------- recorte

def recortar(img: Image.Image, mascara: np.ndarray, caixa, tamanho: int) -> Image.Image:
    x0, y0, x1, y1 = caixa
    figura = img.crop((x0, y0, x1, y1)).convert("RGBA")

    # Aplica a transparencia do fundo so nesta regiao.
    arr = np.array(figura)
    arr[:, :, 3] = np.where(mascara[y0:y1, x0:x1], arr[:, :, 3], 0)
    figura = Image.fromarray(arr)

    # Encaixa na caixa alvo mantendo a proporcao, com folga de 6%.
    util = int(tamanho * 0.88)
    escala = min(util / figura.width, util / figura.height)
    novo = (max(1, round(figura.width * escala)), max(1, round(figura.height * escala)))
    figura = figura.resize(novo, Image.LANCZOS)

    tela = Image.new("RGBA", (tamanho, tamanho), (0, 0, 0, 0))
    tela.paste(figura, ((tamanho - novo[0]) // 2, (tamanho - novo[1]) // 2), figura)
    return tela


def folha_de_conferencia(img: Image.Image, caixas, destino: Path):
    """Numera cada figura na ordem em que sera salva.

    A ordem e o unico ponto onde este fluxo erra feio e em silencio: se a
    numeracao nao bater com a sua lista de nomes, os arquivos saem trocados.
    Sempre olhe esta imagem antes de gravar.
    """
    prova = img.convert("RGBA").copy()
    d = ImageDraw.Draw(prova)
    for i, (x0, y0, x1, y1) in enumerate(caixas, 1):
        d.rectangle((x0, y0, x1, y1), outline=(255, 0, 128, 255), width=4)
        d.rectangle((x0, y0, x0 + 54, y0 + 42), fill=(255, 0, 128, 255))
        d.text((x0 + 12, y0 + 10), str(i), fill=(255, 255, 255, 255))
    prova.convert("RGB").save(destino)


# ----------------------------------------------------------------------- main

def main() -> int:
    p = argparse.ArgumentParser(description="Fatia folha de sprites em PNGs com alpha.")
    p.add_argument("folha", type=Path)
    p.add_argument("--saida", type=Path, help="pasta de destino")
    p.add_argument("--nomes", default="", help="nomes em ordem de leitura, separados por virgula")
    p.add_argument("--tamanho", type=int, default=256)
    p.add_argument("--tolerancia", type=int, default=28, help="folga na cor do fundo")
    p.add_argument("--raio", type=int, default=6, help="dilatacao que une partes soltas")
    p.add_argument("--area-minima", type=int, default=900, help="descarta sujeira menor que isso")
    p.add_argument("--altura-minima", type=int, default=0,
                   help="descarta figuras mais baixas que isso; util contra titulo de secao")
    p.add_argument("--regiao", default="",
                   help="recorta antes de detectar: x0,y0,x1,y1. Use para fatiar uma secao por vez")
    p.add_argument("--grade", default="",
                   help="COLSxLINHAS. Uma figura por celula, sem adivinhar componente. "
                        "Use quando a folha tiver grade regular")
    p.add_argument("--conferir", action="store_true", help="so gera a folha numerada, nao grava sprites")
    args = p.parse_args()

    if not args.folha.exists():
        print(f"x nao achei {args.folha}", file=sys.stderr)
        return 1

    img = Image.open(args.folha).convert("RGBA")

    # Uma folha com varias secoes tem titulo escrito entre elas, e o titulo
    # e detectado como figura. Recortar a secao antes de detectar resolve
    # isso e ainda deixa a lista de nomes curta o bastante para conferir.
    if args.regiao:
        try:
            x0, y0, x1, y1 = (int(v) for v in args.regiao.split(","))
        except ValueError:
            print("x --regiao precisa de quatro numeros: x0,y0,x1,y1", file=sys.stderr)
            return 1
        img = img.crop((x0, y0, x1, y1))

    arr = np.array(img)

    mascara = mascara_do_conteudo(arr, args.tolerancia)

    if args.grade:
        try:
            colunas, linhas = (int(v) for v in args.grade.lower().split("x"))
        except ValueError:
            print("x --grade precisa do formato COLSxLINHAS, por exemplo 4x4", file=sys.stderr)
            return 1
        caixas = caixas_por_grade(mascara, colunas, linhas)
    else:
        caixas = componentes(dilatar(mascara, args.raio))
        caixas = [c for c in caixas if (c[2] - c[0]) * (c[3] - c[1]) >= args.area_minima]
        caixas = [c for c in caixas if (c[3] - c[1]) >= args.altura_minima]
        caixas = ordem_de_leitura(caixas)

    if not caixas:
        print("x nenhuma figura encontrada. Tente --tolerancia maior.", file=sys.stderr)
        return 1

    prova = args.folha.with_name(args.folha.stem + "-conferencia.png")
    folha_de_conferencia(img, caixas, prova)
    print(f"  {len(caixas)} figura(s) encontrada(s)")
    print(f"  confira a ordem em: {prova}")

    if args.conferir:
        return 0

    if not args.saida:
        print("x informe --saida", file=sys.stderr)
        return 1

    nomes = [n.strip() for n in args.nomes.split(",") if n.strip()]
    if nomes and len(nomes) != len(caixas):
        print(f"! atencao: {len(nomes)} nome(s) para {len(caixas)} figura(s).")

    args.saida.mkdir(parents=True, exist_ok=True)
    for i, caixa in enumerate(caixas):
        nome = nomes[i] if i < len(nomes) else f"sem-nome-{i + 1:02d}"
        sprite = recortar(img, mascara, caixa, args.tamanho)
        sprite.save(args.saida / f"{nome}.png")
        sprite.save(args.saida / f"{nome}.webp", quality=90, method=6)
        print(f"  {i + 1:2d}. {nome}")

    print(f"\nok {len(caixas)} sprite(s) em {args.saida}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
