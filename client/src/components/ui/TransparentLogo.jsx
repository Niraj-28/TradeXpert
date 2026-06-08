import { useEffect, useState } from "react";
import logoSrc from "../../assets/Logo.png";

const TransparentLogo = ({ className, alt = "TradeXpert", style, invertText = false }) => {
  const [processedSrc, setProcessedSrc] = useState("");

  useEffect(() => {
    const img = new Image();
    img.src = logoSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const width = img.width;
      const height = img.height;

      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Process pixels
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        const isWhite = (r, g, b) => r > 220 && g > 220 && b > 220;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (isWhite(r, g, b)) {
            // Make any white pixel transparent (outer background + inner letters counters)
            data[i + 3] = 0;
          } else if (invertText && data[i + 3] > 0) {
            // Invert dark text to white if invertText is true
            // Green pixels have a strong green component
            const isGreen = g > 110 && g > r + 15;
            if (!isGreen) {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL());
      } catch (e) {
        console.error("TransparentLogo pixel processing failed:", e);
        setProcessedSrc(logoSrc);
      }
    };
  }, [invertText]);

  return (
    <img
      src={processedSrc || logoSrc}
      className={className}
      alt={alt}
      style={{
        height: "26px", // Default small size
        objectFit: "contain",
        ...style,
        display: "block",
        maxWidth: "100%"
      }}
    />
  );
};

export default TransparentLogo;
