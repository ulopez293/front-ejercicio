export const deleteTraslado = async (id: string) => {
    const response = await fetch(`${import.meta.env.VITE_URL_API}/traslados/${id}`, {
        method: "DELETE",
    })
    if (!response.ok) throw new Error("Error al eliminar el traslado")
    return response.json()
}