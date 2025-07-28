const fetch = require("node-fetch");

exports.handler = async (event) => {
  const tokenId = event.path.split("/").pop(); // get tokenId from URL

  try {
    // 1️⃣ Fetch ARB price from Coinbase
    const response = await fetch("https://api.coinbase.com/v2/prices/ARB-USD/spot");
    const data = await response.json();
    const arbPrice = data.data.amount;

    // 2️⃣ Build Minimal Black SVG
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="350" viewBox="0 0 350 350">
        <rect width="100%" height="100%" fill="black"/>
        <text x="50%" y="140" text-anchor="middle" font-family="Arial, sans-serif"
              font-size="40" fill="white" font-weight="bold">ARB</text>
        <text x="50%" y="220" text-anchor="middle"
              font-size="36" font-family="Arial, sans-serif" fill="white">$${arbPrice}</text>
      </svg>
    `;

    // 3️⃣ Encode SVG to Base64
    const svgBase64 = Buffer.from(svg).toString("base64");

    // 4️⃣ Build Metadata JSON
    const metadata = {
      name: `Arbitrum Price NFT #${tokenId}`,
      description: "A dynamic NFT showing live ARB token price from Coinbase.",
      image: `data:image/svg+xml;base64,${svgBase64}`,
      attributes: [
        { trait_type: "Token", value: "ARB" },
        { trait_type: "Price (USD)", value: arbPrice }
      ]
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch price" }) };
  }
};
