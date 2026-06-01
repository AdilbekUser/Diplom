from __future__ import annotations

import argparse
from pathlib import Path
import sys


DEPS = Path(__file__).resolve().parent / "_python_deps"
if DEPS.exists():
    sys.path.insert(0, str(DEPS))

import pypdfium2 as pdfium


def render_pdf_pages(pdf_path: Path, output_dir: Path, scale: float) -> int:
    output_dir.mkdir(parents=True, exist_ok=True)
    pdf = pdfium.PdfDocument(str(pdf_path))
    for index in range(len(pdf)):
        page = pdf[index]
        bitmap = page.render(scale=scale)
        image = bitmap.to_pil()
        image.save(output_dir / f"page-{index + 1:03}.png")
    return len(pdf)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf_path", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--scale", type=float, default=1.6)
    args = parser.parse_args()
    pages = render_pdf_pages(args.pdf_path, args.output_dir, args.scale)
    print({"pages": pages, "output_dir": str(args.output_dir), "scale": args.scale})


if __name__ == "__main__":
    main()
