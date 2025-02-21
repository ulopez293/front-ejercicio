import { InitialFormType } from "../home/Home"

export const saveTraslado = async (data: InitialFormType) => {
    const response = await fetch(`${import.meta.env.VITE_URL_API}/traslados/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Error al guardar el traslado")
    return response.json();
}