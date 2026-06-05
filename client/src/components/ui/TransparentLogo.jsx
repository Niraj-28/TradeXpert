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

        // BFS Flood-fill to remove only connected white background pixels
        const visited = new Uint8Array(width * height);
        const queue = [];

        const isWhite = (r, g, b) => r > 220 && g > 220 && b > 220;

        // Push border pixels to queue if they are white
        for (let x = 0; x < width; x++) {
          // Top row
          let idx = x;
          if (isWhite(data[idx * 4], data[idx * 4 + 1], data[idx * 4 + 2])) {
            queue.push(idx);
            visited[idx] = 1;
          }
          // Bottom row
          idx = (height - 1) * width + x;
          if (isWhite(data[idx * 4], data[idx * 4 + 1], data[idx * 4 + 2])) {
            queue.push(idx);
            visited[idx] = 1;
          }
        }

        for (let y = 1; y < height - 1; y++) {
          // Left column
          let idx = y * width;
          if (isWhite(data[idx * 4], data[idx * 4 + 1], data[idx * 4 + 2])) {
            queue.push(idx);
            visited[idx] = 1;
          }
          // Right column
          idx = y * width + (width - 1);
          if (isWhite(data[idx * 4], data[idx * 4 + 1], data[idx * 4 + 2])) {
            queue.push(idx);
            visited[idx] = 1;
          }
        }

        // BFS traversal
        let head = 0;
        while (head < queue.length) {
          const idx = queue[head++];
          const x = idx % width;
          const y = Math.floor(idx / width);

          // Mark this background pixel as transparent
          data[idx * 4 + 3] = 0;

          // Check 4 neighbors
          const neighbors = [];
          if (x > 0) neighbors.push(idx - 1);
          if (x < width - 1) neighbors.push(idx + 1);
          if (y > 0) neighbors.push(idx - width);
          if (y < height - 1) neighbors.push(idx + width);

          for (let i = 0; i < neighbors.length; i++) {
            const nIdx = neighbors[i];
            if (!visited[nIdx]) {
              const nr = data[nIdx * 4];
              const ng = data[nIdx * 4 + 1];
              const nb = data[nIdx * 4 + 2];
              if (isWhite(nr, ng, nb)) {
                queue.push(nIdx);
                visited[nIdx] = 1;
              }
            }
          }
        }

        // Invert dark text to white if invertText is true
        if (invertText) {
          for (let i = 0; i < data.length; i += 4) {
            const idx = i / 4;
            // Only process non-background pixels
            if (visited[idx] === 0 && data[i + 3] > 0) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              // Check if pixel is dark grey/black (part of "T" or "Trade")
              // Green pixels have a strong green component
              const isGreen = g > 110 && g > r + 15;
              if (!isGreen) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
              }
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
