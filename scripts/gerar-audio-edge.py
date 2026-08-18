"""Gera os clipes de narracao com a voz neural pt-BR do Edge.

Contrapartida em Python de scripts/gerar-audio.ts. Existe separado porque
o edge-tts nao e uma API REST: e o protocolo por websocket que o "Ler em
voz alta" do Edge usa, e so ha cliente em Python.

REGRA IMPORTANTE, igual a do gerar-audio.ts: arquivo que ja existe nunca e
sobrescrito. E assim que a voz gravada da professora convive com a
sintetica -- ela grava as falas que quiser, o script preenche o resto.

Procedencia: este endpoint nao e um servico contratado da Microsoft. Foi
uma escolha consciente do Danilo em 17/08/2026, sabendo que pode parar de
funcionar e que o uso programatico e area cinzenta nos termos dela. Os MP3
gerados ficam no projeto; se o endpoint cair, o que existe continua
tocando.

Uso:
    python scripts/gerar-audio-edge.py            gera o que falta
    python scripts/gerar-audio-edge.py --limite 5 gera so as 5 primeiras
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

VOZ = "pt-BR-FranciscaNeural"

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "public" / "falas"

# Intencao -> prosodia. O edge-tts nao aceita instrucao de estilo em texto
# livre como o OpenAI; o que ele da e ritmo, tom e volume. Ritmo e o que
# mais carrega a intencao, e por isso varia mais que o tom -- deslocamento
# grande de pitch soa eletronico, que e o oposto do que queremos.
#
# Espelha a tabela de scripts/vozes.ts, adaptada ao que este motor aceita.
PROSODIA = {
    "instrucao":         {"rate": "-8%",  "pitch": "+0Hz"},
    "pergunta":          {"rate": "-5%",  "pitch": "+15Hz"},
    "comemoracao":       {"rate": "+8%",  "pitch": "+25Hz"},
    "consolo":           {"rate": "-10%", "pitch": "-5Hz"},
    "convite-movimento": {"rate": "+3%",  "pitch": "+15Hz"},
    "curiosidade":       {"rate": "-10%", "pitch": "+5Hz"},
    "acalmar":           {"rate": "-20%", "pitch": "-10Hz"},
}

TENTATIVAS = 3


async def gerar(fala: dict, destino: Path) -> None:
    p = PROSODIA[fala["intencao"]]
    erro = None

    for tentativa in range(1, TENTATIVAS + 1):
        try:
            fala_tts = edge_tts.Communicate(
                fala["texto"], VOZ, rate=p["rate"], pitch=p["pitch"]
            )
            # Escreve num temporario e so entao renomeia: interrupcao no meio
            # deixaria um MP3 truncado que o "nunca sobrescrever" preservaria
            # para sempre, e o app tocaria meia fala sem nenhum erro.
            temp = destino.with_suffix(".parcial")
            await fala_tts.save(str(temp))
            if temp.stat().st_size == 0:
                raise RuntimeError("arquivo vazio")
            temp.replace(destino)
            return
        except Exception as e:  # noqa: BLE001
            erro = e
            if tentativa < TENTATIVAS:
                await asyncio.sleep(2 * tentativa)

    raise RuntimeError(f"falhou apos {TENTATIVAS} tentativas: {erro}")


async def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limite", type=int, default=0, help="gera no maximo N falas")
    args = ap.parse_args()

    arquivo = PASTA / "falas.json"
    if not arquivo.exists():
        print("x public/falas/falas.json nao existe. Rode `npm run falas:extrair` antes.")
        return 1

    falas = json.loads(arquivo.read_text(encoding="utf-8"))
    faltando = [f for f in falas if not (PASTA / f"{f['chave']}.mp3").exists()]

    if args.limite:
        faltando = faltando[: args.limite]

    print(f"{len(falas)} falas no total, {len(faltando)} a gerar, voz {VOZ}")
    if not faltando:
        print("v nada a fazer")
        return 0

    feitas = 0
    for i, fala in enumerate(faltando, 1):
        destino = PASTA / f"{fala['chave']}.mp3"
        try:
            await gerar(fala, destino)
        except RuntimeError as e:
            print(f"x {fala['chave']} {e}")
            return 1

        feitas += 1
        kb = destino.stat().st_size / 1024
        print(f"  {i:3}/{len(faltando)}  {fala['chave']}  [{fala['intencao']:17}] {kb:5.1f} KB  {fala['texto'][:44]}")
        sys.stdout.flush()
        # Folga entre pedidos: o endpoint e gentil, mas 343 rajadas seguidas
        # nao sao um uso educado de um servico que nao nos deve nada.
        await asyncio.sleep(0.25)

    total = sum(p.stat().st_size for p in PASTA.glob("*.mp3"))
    print(f"\nv {feitas} gerada(s). {total / 1048576:.1f} MB em public/falas/")
    print("  agora rode `npm run falas:manifesto`")
    return 0


raise SystemExit(asyncio.run(main()))
