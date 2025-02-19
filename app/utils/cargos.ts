export async function fetchCargos(params) {
  try {
    const queryParams = new URLSearchParams();

    const optionalParams = [
      "cif",
      "empresa",
      "persona",
      "cargo",
      "desde",
      "hasta",
    ];

    console.log("PARAMS", params);

    optionalParams.forEach((param) => {
      const values = params[param];
      if (values) {
        if (Array.isArray(values)) {
          values.forEach((value) => queryParams.append(param, value));
        } else {
          queryParams.append(param, values);
        }
      }
    });

    const queryString = queryParams.toString();
    const url = `/api/cargos${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos de Tinybird para cargos");
    }

    const json = await response.json();
    console.log("CARGOS", json.data);

    return json.data;
  } catch (error) {
    console.error("Error en fetchCargos:", error);
    throw error;
  }
}
