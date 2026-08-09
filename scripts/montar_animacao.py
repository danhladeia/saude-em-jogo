#!/usr/bin/env python
"""
Monta uma animacao a partir de quadros PNG soltos (a saida do fatiador).

Gera tres formatos, do melhor para o pior:

  tira.png    faixa horizontal com todos os quadros, para animar em CSS com
              steps(). E o formato preferido: alpha de 8 bits, sem recodificar
              cor, e o navegador controla play/pause pelo CSS.
  anim.webp   WebP animado. Alpha completo, ~1/5 do tamanho de um GIF.
  anim.png    APNG. Mesma qualidade do WebP animado, compatibilidade mais ampla.

GIF NAO e gerado de proposito. GIF tem 256 cores e transparencia de 1 bit: a
paleta do app tem degrade suave e os sprites ficam sobre cards coloridos, entao
o GIF entrega serrilhado duro na borda e faixas de cor no degrade. E o arquivo
sai maior. Nao ha caso neste app em que GIF seja a melhor escolha.

Uso:
    python scripts/montar_animacao.py quadros/*.png \
        --saida src/assets/library/personagem/acenar --fps 8
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image


def main() -> int:
    p = argparse.ArgumentParser(description="Monta animacao a partir de quadros PNG.")
    p.add_argument("quadros", nargs="+", type=Path, help="na ordem da animacao")
    p.add_argument("--saida", type=Path, required=True, help="prefixo de saida, sem extensao")
    p.add_argument("--fps", type=int, default=8)
    p.add_argument("--pingue-pongue", action="store_true",
                   help="acrescenta os quadros de volta, para o laco fechar sem corte")
    args = p.parse_args()

    caminhos = [c for c in args.quadros if c.exists()]
    if len(caminhos) < 2:
        print("x preciso de pelo menos 2 quadros.", file=sys.stderr)
        return 1

    quadros = [Image.open(c).convert("RGBA") for c in caminhos]

    # Todos os quadros no mesmo tamanho, senao a tira desalinha.
    larg = max(q.width for q in quadros)
    alt = max(q.height for q in quadros)
    normalizados = []
    for q in quadros:
        tela = Image.new("RGBA", (larg, alt), (0, 0, 0, 0))
        tela.paste(q, ((larg - q.width) // 2, (alt - q.height) // 2), q)
        normalizados.append(tela)

    if args.pingue_pongue and len(normalizados) > 2:
        normalizados += normalizados[-2:0:-1]

    args.saida.parent.mkdir(parents=True, exist_ok=True)
    n = len(normalizados)
    ms = round(1000 / args.fps)

    tira = Image.new("RGBA", (larg * n, alt), (0, 0, 0, 0))
    for i, q in enumerate(normalizados):
        tira.paste(q, (i * larg, 0), q)
    tira.save(args.saida.with_name(args.saida.name + "-tira.png"))

    normalizados[0].save(
        args.saida.with_name(args.saida.name + ".webp"),
        save_all=True, append_images=normalizados[1:],
        duration=ms, loop=0, quality=90, method=6,
    )
    normalizados[0].save(
        args.saida.with_name(args.saida.name + ".png"),
        save_all=True, append_images=normalizados[1:], duration=ms, loop=0,
    )

    print(f"ok {n} quadro(s) de {larg}x{alt} a {args.fps} fps")
    print(f"   {args.saida.name}-tira.png   ({tira.width}x{tira.height})")
    print(f"   {args.saida.name}.webp")
    print(f"   {args.saida.name}.png  (APNG)")
    print()
    print("CSS para a tira (o formato preferido):")
    print(f"""
.{args.saida.name} {{
  width: {larg}px;
  height: {alt}px;
  background: url('./{args.saida.name}-tira.png') 0 0 / {n * 100}% 100% no-repeat;
  animation: {args.saida.name}-passos {n / args.fps:.2f}s steps({n}) infinite;
}}
@keyframes {args.saida.name}-passos {{
  to {{ background-position: -{n * 100}% 0; }}
}}
@media (prefers-reduced-motion: reduce) {{
  .{args.saida.name} {{ animation: none; }}
}}""")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
