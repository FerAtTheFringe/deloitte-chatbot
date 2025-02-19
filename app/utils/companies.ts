export async function fetchCompanies(params) {
  try {
    const queryParams = new URLSearchParams();

    const optionalParams = [
      "cif",
      "empresa",
      "es_comprador",
      "es_vendedor",
      "es_promotor",
      "es_constructor",
      "tipo",
      "empleados",
      "unidades",
      "localidad",
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
    const url = `/api/companies${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos de Tinybird para empresas");
    }

    const json = await response.json();
    console.log("COMPANIES", json.data);

    return json.data;
  } catch (error) {
    console.error("Error en fetchCompanies:", error);
    throw error;
  }
}
