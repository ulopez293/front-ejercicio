import { Button, Modal, Select } from 'flowbite-react'
import { User } from '../../../interfaces/User'
import { Subject } from '../../../interfaces/Subject'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { mutate } from 'swr'

interface ModalData {
    type: string
    isOpen: boolean
    id_user: number
}

interface ModalSubjectsParams {
    usersData: User[]
    subjectsData: Subject[]
    dataModal: ModalData
    setOpenModal: React.Dispatch<React.SetStateAction<ModalData>>

}

export const ModalSubjects = ({ usersData, subjectsData, dataModal, setOpenModal }: ModalSubjectsParams) => {
    const [actualSubtema, setActualSubtema] = useState({
        id_subtema: 0,
        subtema: ``
    })
    const [actualTema, setActualTema] = useState({
        id_tema: 0,
        tema: ``
    })
    const [isDisabledDelete, setIsDisabledDelete] = useState(true)

    useEffect(() => {
        const user = getUserByOID(dataModal.id_user)
        console.log(user)

        if (user?.subtemas && user?.subtemas.length > 0) {
            setIsDisabledDelete(false)
        }
        if (user?.subtemas && !user?.subtemas.length) {
            setIsDisabledDelete(true)
        }
    }, [dataModal.id_user])

    console.log(usersData)
    console.log(subjectsData)


    const getUserByOID = (oid: number) => {
        return usersData.find(user => user.OID === oid)
    }

    const searchTextSubtema = (id: number) => {
        for (const subject of subjectsData) {
            for (const subtema of subject.subtemas) {
                if (subtema.id_subtema === id) return subtema.name
            }
        }
    }

    const searchTemaFromIDSubtema = (id: number) => {
        for (const subject of subjectsData) {
            for (const subtema of subject.subtemas) {
                if (subtema.id_subtema === id) return {
                    id_tema: subject.id_tema,
                    tema: subject.tema
                }
            }
        }
    }

    const subtemasOfGeneral = () => {
        const user = getUserByOID(dataModal.id_user)
        if (!user) return null


        const subtemas = Array.from(new Set(user.subtemas))

        const options = []
        let subtemasTotal: { id_subtema: number, name: string }[] = []
        for (const subject of subjectsData) {
            subtemasTotal = [...subtemasTotal, ...subject.subtemas]
        }

        // Ordenar los subtemas por el nombre
        subtemasTotal.sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
        })

        for (const subtema of subtemasTotal) {
            if (!subtemas.includes(subtema.id_subtema)) {
                options.push(
                    <option key={subtema.id_subtema} value={subtema.id_subtema} >{subtema.name}</option>
                )
            }
        }

        return options
    }

    const subtemasOfUser = () => {
        const user = getUserByOID(dataModal.id_user)
        if (!user) return null


        const subtemas = Array.from(new Set(user.subtemas))

        const options = []
        let subtemasTotal: { id_subtema: number, name: string }[] = []
        for (const subject of subjectsData) {
            subtemasTotal = [...subtemasTotal, ...subject.subtemas]
        }

        // Ordenar los subtemas por el nombre
        subtemasTotal.sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
        })

        for (const subtema of subtemasTotal) {
            if (subtemas.includes(subtema.id_subtema)) {
                options.push(
                    <option key={subtema.id_subtema} value={subtema.id_subtema} >{subtema.name}</option>
                )
            }
        }

        return options
    }

    const handleChangeSubtema = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id_subtema = Number(e.target.value)
        const temaElement = searchTemaFromIDSubtema(id_subtema)
        if (!temaElement) {
            alert(`Este subtema no tiene tema`)
            return
        }
        const textSubtema = searchTextSubtema(id_subtema) ?? ``
        setActualSubtema({ subtema: textSubtema, id_subtema: id_subtema })
        setActualTema(temaElement)
    }

    const resetExit = () => {
        setActualSubtema({ subtema: ``, id_subtema: 0 })
        setActualTema({ tema: ``, id_tema: 0 })
        setOpenModal({ isOpen: false, type: '', id_user: 0 })
    }

    const aniadirSubtema = () => {
        const addSubject = async () => {
            try {
                const dataBody = {
                    id_user: dataModal.id_user,
                    tema: actualTema,
                    subtema: actualSubtema
                }
                console.log(dataBody)

                const response = await axios.post(`${import.meta.env.VITE_URL_SUBJECTS_API}/add/subjects/user`, dataBody, {
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = response?.data as unknown
                console.log('Respuesta exitosa:', data)

                setActualSubtema({ subtema: ``, id_subtema: 0 })
                setOpenModal({ isOpen: false, type: '', id_user: 0 })
                void mutate(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`)
                void mutate(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`)
            } catch (error) {
                console.error('Error en la solicitud:', error)
            }
        }
        void addSubject()
    }

    const removerSubtema = () => {
        const removeSubject = async () => {
            try {
                const dataBody = {
                    id_user: dataModal.id_user,
                    tema: actualTema,
                    subtema: actualSubtema
                }
                console.log(dataBody)
                const response = await axios.patch(`${import.meta.env.VITE_URL_SUBJECTS_API}/remove/subjects/user`, dataBody, {
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = response?.data as unknown
                console.log('Respuesta exitosa:', data)

                setActualSubtema({ subtema: ``, id_subtema: 0 })
                setOpenModal({ isOpen: false, type: '', id_user: 0 })
                void mutate(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`)
                void mutate(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`)

            } catch (error) {
                console.error('Error en la solicitud:', error)
            }
        }
        void removeSubject()
    }

    return (
        <>
            {
                dataModal.type === `ADD_SUBTEMA` ?
                    <Modal dismissible show={dataModal.isOpen} onClose={resetExit}>
                        <Modal.Header>Selecciona Subtema a Añadir</Modal.Header>
                        <Modal.Body>
                            <div className="space-y-6">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    Tema: {actualTema.tema}
                                </p>
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    Subtema: {actualSubtema.subtema}
                                </p>
                            </div>
                            <br />
                            <hr />
                            <br />
                            <Select required value={actualSubtema.id_subtema} onChange={handleChangeSubtema}>
                                <option value="0" disabled>- Lista de Subtemas -</option>
                                {subtemasOfGeneral()}
                            </Select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button color="success" pill onClick={aniadirSubtema}>
                                Añadir
                            </Button>
                            <Button color="light" pill onClick={resetExit}>
                                Salir
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    : null
            }
            {
                dataModal.type === `REMOVE_SUBTEMA` ?
                    <Modal dismissible show={dataModal.isOpen} onClose={resetExit}>
                        <Modal.Header>Seleccionar Subtema a Eliminar</Modal.Header>
                        <Modal.Body>
                            <div className="space-y-6">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    Tema: {actualTema.tema}
                                </p>
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    Subtema: {actualSubtema.subtema}
                                </p>
                            </div>
                            <br />
                            <hr />
                            <br />
                            <Select required value={actualSubtema.id_subtema} onChange={handleChangeSubtema}>
                                <option value="0" disabled>- Lista de Subtemas -</option>
                                {subtemasOfUser()}
                            </Select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button color="failure" pill onClick={removerSubtema} disabled={isDisabledDelete}>
                                Remover
                            </Button>
                            <Button color="light" pill onClick={resetExit}>
                                Salir
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    : null
            }
        </>
    )
}