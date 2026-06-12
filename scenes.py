"""Les 4 scènes du MVP : identifiants, titres bilingues et prompts Gemini."""

SCENES = [
    {
        "id": "evjf",
        "title_fr": "Soirée EVJF",
        "title_en": "Bachelorette party",
        "prompt": (
            "Place this design as a real printed paper card on a styled "
            "bachelorette tabletop with champagne coupes, blush florals, gold "
            "confetti, hands toasting in soft bokeh. Natural daylight, 3/4 angle, "
            "magazine quality, photorealistic, preserve every detail of original."
        ),
    },
    {
        "id": "wine",
        "title_fr": "Dégustation vin",
        "title_en": "Wine tasting",
        "prompt": (
            "Place this design as a printed card on a rustic wooden table during "
            "a wine tasting with red wine glasses, cheese board, vintage candles. "
            "Golden hour light, top-down 45 degrees, photorealistic, preserve "
            "every detail of the original design."
        ),
    },
    {
        "id": "wedding",
        "title_fr": "Table de mariage",
        "title_en": "Wedding table",
        "prompt": (
            "Place this design as a printed card on an elegant wedding reception "
            "table with white roses, fine china, crystal glasses, ivory linen, "
            "candlelight. Editorial wedding photography, soft window light, "
            "photorealistic, preserve every detail of the original design."
        ),
    },
    {
        "id": "gift",
        "title_fr": "Boîte cadeau",
        "title_en": "Gift box",
        "prompt": (
            "Place this design as a printed insert inside a luxury gift box with "
            "satin ribbon, kraft paper, dried lavender on white marble. Overhead "
            "flat-lay, soft diffused light, photorealistic, preserve every detail "
            "of the original design."
        ),
    },
]

SCENES_BY_ID = {scene["id"]: scene for scene in SCENES}
