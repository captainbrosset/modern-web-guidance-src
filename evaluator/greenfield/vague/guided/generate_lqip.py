from PIL import Image, ImageFilter
import sys

def create_lqip(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            # Resize to small dimension for LQIP
            small_img = img.resize((50, 50))
            # Blur
            blurred_img = small_img.filter(ImageFilter.GaussianBlur(radius=2))
            # Save
            blurred_img.save(output_path, quality=50)
            print(f"Created {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_lqip("images/hero-high.png", "images/hero-low.jpg")
