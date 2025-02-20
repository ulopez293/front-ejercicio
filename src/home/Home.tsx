import { useState } from "react"
import { fetchTraslados, Traslado } from "../fetch/fetchTraslados"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { emissionFactors } from "../data/emisionData"

export const Home = () => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [actualID, setActualID] = useState("")
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        partida: "",
        destino: "",
        transporte: "",
        fecha: "",
        kilometros: "",
        trabajador: "",
        idaVuelta: false,
    })

    const { data: traslados = [], isLoading, isError, error } = useQuery({
        queryKey: ["traslados"],
        queryFn: fetchTraslados,
    })

    const saveTraslado = async (data: typeof formData) => {
        const response = await fetch(`${import.meta.env.VITE_URL_API}/traslados/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Error al guardar el traslado");
        return response.json();
    }

    const mutation = useMutation({
        mutationFn: saveTraslado,
        onSuccess: () => {
            alert("Traslado guardado con éxito")
            setFormData({
                partida: "",
                destino: "",
                transporte: "",
                fecha: "",
                kilometros: "",
                trabajador: "",
                idaVuelta: false,
            });
            void queryClient.invalidateQueries({ queryKey: ["traslados"] })
        },
        onError: (error) => {
            console.error("Error al guardar el traslado:", error)
            alert("Hubo un error al guardar el traslado")
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [target.name]: target.type === "checkbox" ? target.checked : target.value,
        }));
    };

    const deleteTraslado = async (id: string) => {
        const response = await fetch(`${import.meta.env.VITE_URL_API}/traslados/${id}`, {
            method: "DELETE",
        })
        if (!response.ok) throw new Error("Error al eliminar el traslado");
        return response.json()
    }

    const deleteMutation = useMutation({
        mutationFn: deleteTraslado,
        onSuccess: () => {
            alert("Traslado eliminado con éxito");
            void queryClient.invalidateQueries({ queryKey: ["traslados"] })
        },
        onError: (error) => {
            console.error("Error al eliminar el traslado:", error)
            alert("Hubo un error al eliminar el traslado")
        },
    })

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id)
    }

    const mutationUpdate = useMutation({
        mutationFn: async (trasladoEditado: Traslado) => {
            const response = await fetch(`${import.meta.env.VITE_URL_API}/traslados/${trasladoEditado._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trasladoEditado),
            });
    
            if (!response.ok) {
                throw new Error("Error al actualizar el traslado");
            }
    
            return response.json();
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["traslados"] })
            setIsEditMode(false)
            setFormData({
                partida: "",
                destino: "",
                transporte: "",
                fecha: "",
                kilometros: "",
                trabajador: "",
                idaVuelta: false,
            })
            setActualID("")
            alert("Traslado actualizado con éxito")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEditMode) {
            mutationUpdate.mutate({
                _id: actualID, // Asegúrate de tener el ID
                partida: formData.partida,
                destino: formData.destino,
                transporte: formData.transporte,
                fecha: formData.fecha,
                kilometros: Number(formData.kilometros),
                trabajador: formData.trabajador,
                idaVuelta: formData.idaVuelta,
            })
            return
        } 
        mutation.mutate(formData)
    }


    const handleEdit = (_id: string) => {
        setIsEditMode(true)
        setActualID(_id)
        const trasladoSeleccionado = traslados.find((t) => t._id === _id)

        
        if (trasladoSeleccionado) {
            console.log(trasladoSeleccionado.fecha)
            setFormData({
                partida: trasladoSeleccionado.partida || "",
                destino: trasladoSeleccionado.destino || "",
                transporte: trasladoSeleccionado.transporte || "",
                fecha: trasladoSeleccionado.fecha ? trasladoSeleccionado.fecha.split("T")[0] : "",
                kilometros: trasladoSeleccionado.kilometros.toString() || "",
                trabajador: trasladoSeleccionado.trabajador || "",
                idaVuelta: trasladoSeleccionado.idaVuelta || false,
            })
        }
    }

    if (isLoading) return <p>Cargando traslados...</p>
    if (isError) return <p className="text-red-500">Error: {error instanceof Error ? error.message : "Error desconocido"}</p>

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-5">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96 mb-6">
                <h2 className="text-xl font-semibold mb-4">Registrar Traslado</h2>

                <label className="block mb-2">Dirección de Partida</label>
                <input type="text" name="partida" value={formData.partida} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Dirección de Destino</label>
                <input type="text" name="destino" value={formData.destino} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Medio de Transporte</label>
                <select
                    name="transporte"
                    value={formData.transporte}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                >
                    <option value="">Seleccione...</option>
                    <option value="Metro (Tren, Subway, Subterráneo)">Metro (Tren, Subway, Subterráneo)</option>
                    <option value="Auto (Gasolina)">Auto (Gasolina)</option>
                    <option value="Camioneta (Diésel)">Camioneta (Diésel)</option>
                    <option value="Motocicleta (Gasolina)">Motocicleta (Gasolina)</option>
                    <option value="Bus Transantiago (Transporte público)">Bus Transantiago (Transporte público)</option>
                    <option value="Bus (Vehículo privado)">Bus (Vehículo privado)</option>
                    <option value="Avión (Nacional)">Avión (Nacional)</option>
                    <option value="Avión (Internacional)">Avión (Internacional)</option>
                    <option value="Caminando">Caminando</option>
                </select>


                <label className="block mb-2">Fecha del Viaje</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Kilómetros Recorridos</label>
                <input type="number" min="1" name="kilometros" value={formData.kilometros} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Nombre del Trabajador</label>
                <input type="text" name="trabajador" value={formData.trabajador} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <div className="flex items-center mb-4">
                    <input type="checkbox" name="idaVuelta" checked={formData.idaVuelta} onChange={handleChange}
                        className="mr-2" />
                    <label>¿Es ida y vuelta?</label>
                </div>
                {
                    isEditMode ?
                        <button type="submit"
                            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                            disabled={mutation.isPending}>
                            {mutation.isPending ? "Editando..." : "Editar Traslado"}
                        </button>
                        :
                        <button type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            disabled={mutation.isPending}>
                            {mutation.isPending ? "Guardando..." : "Guardar Traslado"}
                        </button>
                }
            </form>

            {/* Listado de Traslados */}
            <div className="overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4">Lista de Traslados</h2>

                {isLoading && <p>Cargando traslados...</p>}
                {isError && <p>Error al cargar traslados</p>}
                {!isLoading && !isError && (
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Partida</th>
                                <th className="border p-2">Destino</th>
                                <th className="border p-2">Transporte</th>
                                <th className="border p-2">Kilómetros</th>
                                <th className="border p-2">Fecha</th>
                                <th className="border p-2">Trabajador</th>
                                <th className="border p-2">Ida y Vuelta</th>
                                <th className="border p-2">Factor de Emisión</th>
                                <th className="border p-2">Huella de Carbono</th>
                                <th className="border p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {traslados.map((traslado, index) => {
                                const factorEmision = emissionFactors[traslado.transporte] ?? 0;
                                const huellaCarbono = traslado.kilometros * factorEmision;
                                return (
                                    <tr key={traslado._id ?? index} className="text-center">
                                        <td className="border p-2">{traslado.partida}</td>
                                        <td className="border p-2">{traslado.destino}</td>
                                        <td className="border p-2">{traslado.transporte}</td>
                                        <td className="border p-2">{traslado.kilometros} km</td>
                                        <td className="border p-2">{traslado.fecha}</td>
                                        <td className="border p-2">{traslado.trabajador}</td>
                                        <td className="border p-2">{traslado.idaVuelta ? "Sí" : "No"}</td>
                                        <td className="border p-2">{factorEmision.toFixed(3)} kg CO₂/km</td>
                                        <td className="border p-2">{huellaCarbono.toFixed(2)} kg CO₂</td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => handleDelete(traslado._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 mr-5"
                                            >
                                                Eliminar
                                            </button>

                                            <button
                                                onClick={() => handleEdit(traslado._id)}
                                                className="bg-green-500  text-white px-2 py-1 rounded hover:bg-green-700"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {traslados.length > 0 && (
                                <tr className="text-center font-bold bg-gray-200">
                                    <td className="border p-2" colSpan={8}>Total</td>
                                    <td className="border p-2">
                                        {traslados.reduce((total, traslado) => {
                                            const factor = emissionFactors[traslado.transporte] ?? 0;
                                            return total + traslado.kilometros * factor;
                                        }, 0).toFixed(2)} kg CO₂
                                    </td>
                                    <td className="border p-2"></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
