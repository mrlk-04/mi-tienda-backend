// api/envio.js
export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const origen = process.env.ORIGIN_CITY_CODE || "47001"; // Santa Marta
    const destino = req.query.destino;
    const peso = parseFloat(req.query.peso) || 1;

    if (!destino) {
      return res.status(400).json({ error: "Falta el parámetro destino" });
    }

    const largo = 10;
    const alto = 10;
    const ancho = 10;
    const valorDeclarado = 50000;
    const idProducto = 2;
    const language = "es";

    const url = `https://mobile.servientrega.com/ApiIngresoClientes/api/Cotizador/Tarifas/${origen}/${destino}/${largo}/${alto}/${ancho}/${peso}/${valorDeclarado}/${idProducto}/${language}`;

    // ✅ Agregamos encabezados para evitar bloqueos
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VercelFetch/1.0)",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(500).json({ error: "No se pudo conectar con Servientrega", status: response.status });
    }

    const data = await response.json();

    let costo = null;
    if (data?.Datos?.length > 0) {
      costo = data.Datos[0].ValorTotal;
    }

    return res.status(200).json({
      origen: "Santa Marta",
      destino,
      peso,
      costo,
      respuesta_servientrega: data,
    });
  } catch (error) {
    console.error("Error en /api/envio:", error);
    return res.status(500).json({ error: "Error interno", details: error.message });
  }
}
