// api/envio.js
export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    // Ciudad de origen: Santa Marta
    const origen = process.env.ORIGIN_CITY_CODE || "47001"; // Código DANE de Santa Marta
    const destino = req.query.destino; // Código de ciudad destino (por ejemplo, 11001 = Bogotá)
    const peso = parseFloat(req.query.peso) || 1; // peso en kg (ej: 0.5)

    if (!destino) {
      return res.status(400).json({ error: "Falta el parámetro destino" });
    }

    // Datos del paquete (puedes ajustar)
    const largo = 10;
    const alto = 10;
    const ancho = 10;
    const valorDeclarado = 50000; // en COP
    const idProducto = 2; // paquete
    const language = "es";

    // Endpoint oficial público (cotizador móvil)
    const url = `https://mobile.servientrega.com/ApiIngresoClientes/api/Cotizador/Tarifas/${origen}/${destino}/${largo}/${alto}/${ancho}/${peso}/${valorDeclarado}/${idProducto}/${language}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: "Error al conectar con Servientrega" });
    }

    const data = await response.json();

    // Extraer valor total si existe
    let costo = null;
    if (data && data.Datos && Array.isArray(data.Datos) && data.Datos.length > 0) {
      costo = data.Datos[0].ValorTotal || null;
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
