"""Extract three unchanged Kazakh Khanate geometries from Cliopatria v0.2.1.

Usage: python scripts/import-cliopatria.py /path/to/cliopatria.geojson.zip
The source archive is available from the Seshat Cliopatria repository (CC BY 4.0).
"""

import json
import hashlib
import sys
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PERIODS = [(1468, 1474), (1529, 1555), (1721, 1737)]
ARCHIVE_SHA256 = "e10a4e429fca708788ff9e7572a95fce801fae55852d217cffabc1c59cd4eed4"


def collection(features):
    return {"type": "FeatureCollection", "features": features}


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n")


def main(archive_path):
    digest = hashlib.sha256(Path(archive_path).read_bytes()).hexdigest()
    if digest != ARCHIVE_SHA256:
        raise ValueError("Archive SHA-256 differs from the reviewed Cliopatria source")
    with zipfile.ZipFile(archive_path) as archive:
        names = archive.namelist()
        if names != ["cliopatria_polities_only_v021.geojson"]:
            raise ValueError("Expected the Cliopatria v0.2.1 polities archive")
        with archive.open(names[0]) as source_file:
            source = json.load(source_file)

    for start, end in PERIODS:
        matches = [
            feature for feature in source["features"]
            if feature["properties"]["Name"] == "Kazakh Khanate"
            and feature["properties"]["FromYear"] == start
            and feature["properties"]["ToYear"] == end
        ]
        if len(matches) != 1:
            raise ValueError(f"Expected exactly one Kazakh Khanate polygon for {start}–{end}")

        original = matches[0]
        era_id = f"kazakh-{start}-{end}"
        territory = {
            "type": "Feature",
            "properties": {
                "id": f"{era_id}-territory",
                "eraId": era_id,
                "kind": "territory",
                "name": {"ru": "Казахское ханство"},
                "startYear": start,
                "endYear": end,
                "certainty": "approximate",
                "sourceIds": ["cliopatria-v021"],
                "sourceName": original["properties"]["Name"],
            },
            "geometry": original["geometry"],
        }
        directory = ROOT / "public" / "data" / "eras" / era_id
        write(directory / "territories.geojson", collection([territory]))
        write(directory / "events.geojson", collection([]))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
