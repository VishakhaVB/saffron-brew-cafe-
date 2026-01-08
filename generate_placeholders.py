import os

# Configuration
OUTPUT_DIR = "d:/WEB Project/saffronbrew/images"
DIRS = {
    "coffee": "coffee",
    "snacks": "snacks",
    "interiors": "interiors"
}

# Image Data (Filename, Text, Subdirectory)
IMAGES = [
    # Coffee
    ("malabar_espresso", "Malabar\nEspresso", "coffee"),
    ("cardamom_latte", "Cardamom\nLatte", "coffee"),
    ("filter_coffee", "Filter\nKaapi", "coffee"),
    ("saffron_chai", "Kesar\nMasala Chai", "coffee"),
    ("rose_chai", "Pistachio\n& Rose", "coffee"),
    ("ginger_chai", "Pahadi\nChai", "coffee"),
    ("coconut_cold_brew", "Coconut\nCold Brew", "coffee"),
    ("espresso_tonic", "Espresso\nTonic", "coffee"),
    
    # Snacks/Desserts
    ("truffle_samosa", "Truffle\nSamosa", "snacks"),
    ("brioce_vada_pav", "Brioche\nSliders", "snacks"),
    ("cheese_toast", "Chilli\nCheese Toast", "snacks"),
    ("gulab_jamun_cheesecake", "Gulab Jamun\nCheesecake", "snacks"),
    ("rasmalai_tiramisu", "Rasmalai\nTiramisu", "snacks"),
    ("chocolate_tart", "Spiced\nChocolate", "snacks"),

    # Hero
    ("hero", "Saffron Brew\nInteriors", "interiors"),

    # Index Page specific
    ("cappuccino", "Masala\nCappuccino", "coffee"),
    ("gulab_jamun", "Gulab Jamun\nCheesecake", "snacks"),
    ("chai", "Royal\nKullad Chai", "coffee")
]

# SVG Template
# Dark Coffee: #3E2723, Saffron Gold: #FFCB05
SVG_TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3E2723;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2C1B18;stop-opacity:1" />
    </linearGradient>
    <pattern id="pattern1" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1" fill="#FFCB05" fill-opacity="0.1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad1)" />
  <rect width="100%" height="100%" fill="url(#pattern1)" />
  
  <rect x="50" y="50" width="700" height="500" rx="20" ry="20" fill="none" stroke="#FFCB05" stroke-width="2" stroke-opacity="0.3"/>

  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="48" fill="#FFCB05" font-weight="bold" letter-spacing="2">
    {line1}
  </text>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="32" fill="#FFCB05" font-weight="normal" letter-spacing="1" opacity="0.8">
    {line2}
  </text>
  
  <text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#FFFFFF" opacity="0.4" letter-spacing="3">
    SAFFRON BREW COLLECTION
  </text>
</svg>"""

def generate_svgs():
    for filename, text, subdir in IMAGES:
        # Split text into two lines if needed, otherwise second line is empty
        lines = text.split('\n')
        line1 = lines[0]
        line2 = lines[1] if len(lines) > 1 else ""

        content = SVG_TEMPLATE.format(line1=line1, line2=line2)
        
        # Ensure directory exists
        full_dir = os.path.join(OUTPUT_DIR, DIRS[subdir])
        os.makedirs(full_dir, exist_ok=True)
        
        file_path = os.path.join(full_dir, f"{filename}.svg")
        
        with open(file_path, "w", encoding='utf-8') as f:
            f.write(content)
        
        print(f"Generated: {file_path}")

if __name__ == "__main__":
    generate_svgs()
