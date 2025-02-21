import { Traslado } from "../fetch/fetchTraslados"

export const updateTraslado = async (trasladoEditado: Traslado) => {
    const response = await fetch(`${import.meta.env.VITE_URL_API}/traslados/${trasladoEditado._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trasladoEditado),
    })

    if (!response.ok) throw new Error("Error al actualizar el traslado")

    return response.json()
}