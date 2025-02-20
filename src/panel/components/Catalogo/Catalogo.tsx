
import { Button, Label, Sidebar, TextInput } from 'flowbite-react'
import {
    HiOutlineMinusSm,
    HiOutlinePlusSm,
} from 'react-icons/hi'
import { MdEditSquare } from "react-icons/md"
import { RiMenuAddLine, RiFolderAddFill } from "react-icons/ri"
import { FaList, FaEdit, FaTrashAlt } from "react-icons/fa"
import { CgListTree } from "react-icons/cg"
import { VscGitPullRequestCreate } from "react-icons/vsc"
import { twMerge } from 'tailwind-merge'
import { Subject, Subtema } from '../../../interfaces/Subject'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { mutate } from 'swr'
import { ModalAlert } from '../../../components/ModalAlert/ModalAlert'

enum TypeView {
    TemaEdit,
    SubtemaEdit,
    AddSubject,
    AddSubtema
}

interface TemaEditProps { actualSubject: Subject, setActualView: React.Dispatch<React.SetStateAction<TypeView>> }
const TemaEdit = ({ actualSubject, setActualView }: TemaEditProps) => {
    const [input, setInput] = useState(actualSubject.tema)
    const [openModal, setOpenModal] = useState({ message: ``, show: false })

    useEffect(() => {
        setInput(actualSubject.tema)
    }, [actualSubject.tema])

    const actualizarTema = () => {
        if (!input.trim().length) {
            setOpenModal({ message: `Por favor llena el campo Tema, antes de editar.`, show: true })
            return
        }
        const sendData = async () => {
            try {
                const dataBody = {
                    tema: input,
                    id_tema: actualSubject.id_tema
                }
                console.log(dataBody)

                const response = await axios.patch(`${import.meta.env.VITE_URL_SUBJECTS_API}/edit/tema/catalogo`, dataBody, {
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = response?.data as unknown
                console.log('Respuesta exitosa:', data)

                setOpenModal({ message: `Tema editado correctamente.`, show: true })
                void mutate(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`)
                void mutate(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`)
            } catch (error) {
                console.error('Error en la solicitud:', error)
            }
        }
        void sendData()
    }

    const eliminarTema = () => {
        const sendData = async () => {
            try {

                const response = await axios.delete(`${import.meta.env.VITE_URL_SUBJECTS_API}/remove/tema/${actualSubject.id_tema}`)
                const data = response?.data as unknown
                console.log('Respuesta exitosa:', data)

                setOpenModal({ message: `Tema eliminado correctamente.`, show: true })
                void mutate(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`)
                void mutate(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`)
            } catch (error) {
                setOpenModal({ message: `No puedes eliminar el tema, ya que tiene subtemas asociados. Favor de eliminar los subtemas antes de eliminar.`, show: true })
                console.error('Error en la solicitud:', error)
            }
        }
        void sendData()
    }

    const cambiarDeVista = ()=> {
        setActualView(TypeView.AddSubject)
    }

    return (
        <div className="flex max-w-md flex-col gap-4 mx-2 mr-4 min-w-96">
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="small"
                        value={`ID: ${actualSubject.id_tema}`}
                    />
                </div>
                <TextInput
                    id="small"
                    type="text"
                    sizing="sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>
            <Button gradientMonochrome="purple" pill onClick={actualizarTema}>
                <MdEditSquare className="mx-2" />Actualizar Tema
            </Button>
            <Button gradientMonochrome="failure" pill onClick={eliminarTema}>
                <FaTrashAlt className="mx-2" />Eliminar Tema
            </Button>
            <ModalAlert funcion={cambiarDeVista} openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    )
}

interface SubtemaEditProps { actualSubtema: Subtema, setActualView: React.Dispatch<React.SetStateAction<TypeView>> }
const SubtemaEdit = ({ actualSubtema, setActualView }: SubtemaEditProps) => {
    const [input, setInput] = useState(actualSubtema.name)
    const [openModal, setOpenModal] = useState({ message: ``, show: false })

    useEffect(() => {
        setInput(actualSubtema.name)
    }, [actualSubtema.name])

    const actualizarSubtema = () => {
        if (!input.trim().length) {
            setOpenModal({ message: `Por favor llena el Subtema, antes de editar.`, show: true })
            return
        }
        const sendData = async () => {
            try {
                const dataBody = {
                    subtema: input,
                    id_subtema: actualSubtema.id_subtema
                }
                console.log(dataBody)

                const response = await axios.patch(`${import.meta.env.VITE_URL_SUBJECTS_API}/edit/subtema/catalogo`, dataBody, {
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = response?.data as unknown
                console.log('Respuesta exitosa:', data)

                setOpenModal({ message: `Subtema editado correctamente.`, show: true })
                void mutate(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`)
                void mutate(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`)
            } catch (error) {
                console.error('Error en la solicitud:', error)
            }
        }
        void sendData()
    }

    const eliminarSubtema = () => {
        const sendData = async () => {
            try {

                const response = await axios.delete(`${import.meta.env.VITE_URL_SUBJECTS_API}/remove/subtema/${actualSubtema.id_subtema}`)
                const data = response?.data as unknown
                console.log('Respuesta exitosa:', data)

                setOpenModal({ message: `Subtema eliminado correctamente.`, show: true })
                void mutate(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`)
                void mutate(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`)
            } catch (error) {
                setOpenModal({ message: `No puedes eliminar este subtema, dado que tiene coaches asignados. Por favor, elimina la asociación del subtema con los coaches para proceder con su eliminación.`, show: true })
                console.error('Error en la solicitud:', error)
            }
        }
        void sendData()
    }

    const cambiarDeVista = () => {
        setActualView(TypeView.AddSubject)
    }

    return (
        <div className="flex max-w-md flex-col gap-4 mx-2 mr-4 min-w-96">
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="small"
                        value={`ID: ${actualSubtema.id_subtema}`}
                    />
                </div>
                <TextInput
                    id="small"
                    type="text"
                    sizing="sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>
            <Button gradientMonochrome="purple" pill onClick={actualizarSubtema}>
                <MdEditSquare className="mx-2" />Actualizar Subtema
            </Button>
            <Button gradientMonochrome="failure" pill onClick={eliminarSubtema}>
                <FaTrashAlt className="mx-2" />Eliminar Subtema
            </Button>
            <ModalAlert funcion={cambiarDeVista} openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    )
}

interface AddSubjectProps { 
    fnRepeatTema: (text: string) => boolean,
    fnRepeatSubtema: (text: string) => boolean
}
const AddSubject = ({ fnRepeatTema, fnRepeatSubtema }: AddSubjectProps) => {
    const [nameTema, setNameTema] = useState(``)
    const [nameSubtema, setNameSubtema] = useState(``)
    const [openModal, setOpenModal] = useState({ message: ``, show: false })

    const agregarSubject = () => {
        if (!nameTema.trim().length || !nameSubtema.trim().length) {
            setOpenModal({ message: `Por favor llena los campos, antes de agregar.`, show: true })
            return
        }

        if (fnRepeatTema(nameTema)) {
            setOpenModal({ message: `No puedes agregar un tema repetido.`, show: true })
            return
        }

        if (fnRepeatSubtema(nameSubtema)) {
            setOpenModal({ message: `No puedes agregar un subtema repetido.`, show: true })
            return
        }

        const sendData = async () => {
            try {
                const dataBody = {
                    tema: nameTema,
                    subtemaName: nameSubtema
                }
                console.log(dataBody)

                const response = await axios.post(`${import.meta.env.VITE_URL_SUBJECTS_API}/new/subject/catalogo`, dataBody, {
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = response?.data as unknown
                console.log('Respuesta exitosa:', data)

                setNameTema(``)
                setNameSubtema(``)
                setOpenModal({message:`Tema y Subtema Agregados Correctamente`, show: true })
                void mutate(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`)
                void mutate(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`)
            } catch (error) {
                console.error('Error en la solicitud:', error)
            }
        }
        void sendData()
    }

    return (
        <div className="flex max-w-md flex-col gap-4 mx-2 mr-4 min-w-96">
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="tema" value="Nombre del Tema:" />
                </div>
                <TextInput value={nameTema} onChange={(e) => setNameTema(e.target.value)} id="tema" type="text" sizing="sm" placeholder='Ingresa el nombre del Tema a crear' />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="subtema" value="Nombre del Subtema:" />
                </div>
                <TextInput value={nameSubtema} onChange={(e) => setNameSubtema(e.target.value)} id="subtema" type="text" sizing="sm" placeholder='Ingresa un nombre minimo para un Subtema' />
            </div>
            <Button gradientMonochrome="success" pill onClick={agregarSubject}>
                <VscGitPullRequestCreate className="mx-2" /> Agregar Tema/Subtema
            </Button>
            <ModalAlert openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    )
}

interface AddSubtemaProps { 
    actualSubject: Subject,
    fnRepeatSubtema: (text: string) => boolean
}
const AddSubtema = ({ actualSubject, fnRepeatSubtema }: AddSubtemaProps) => {
    const [nameSubtema, setNameSubtema] = useState(``)
    const [openModal, setOpenModal] = useState({ message: ``, show: false })

    const agregarSubtema = () => {
        if (!nameSubtema.trim().length) {
            setOpenModal({ message: `Por favor llena el Subtema, antes de agregar.`, show: true })
            return
        }

        if (fnRepeatSubtema(nameSubtema)) {
            setOpenModal({ message: `No puedes agregar un subtema repetido.`, show: true })
            return
        }
        const sendData = async () => {
            try {
                const dataBody = {
                    id_tema: actualSubject.id_tema,
                    subtemaName: nameSubtema
                }
                console.log(dataBody)

                const response = await axios.post(`${import.meta.env.VITE_URL_SUBJECTS_API}/new/subtema/catalogo`, dataBody, {
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = response?.data as unknown
                console.log('Respuesta exitosa:', data)

                setNameSubtema(``)
                setOpenModal({ message: `Subtema Agregado correctamente.`, show: true })
                void mutate(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`)
                void mutate(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`)
            } catch (error) {
                console.error('Error en la solicitud:', error)
            }
        }
        void sendData()
    }

    return (
        <div className="flex max-w-md flex-col gap-4 mx-2 mr-4 min-w-96">
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="subtema" value={`[ ${actualSubject.tema} ] : Añadir un nuevo subtema: `} />
                </div>
                <TextInput value={nameSubtema} onChange={(e) => setNameSubtema(e.target.value)} id="subtema" type="text" sizing="sm" placeholder='Nombre del nuevo Subtema' />
            </div>
            <Button gradientMonochrome="teal" pill onClick={agregarSubtema}>
                <VscGitPullRequestCreate className="mx-2" />Agregar Subtema
            </Button>
            <ModalAlert openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    )
}

interface CatalogoProps {
    subjectsData: Subject[]
}
export const Catalogo = ({ subjectsData }: CatalogoProps) => {
    const [actualView, setActualView] = useState(TypeView.AddSubject)
    const [actualSubject, setActualSubject] = useState<Subject | null>(null)
    const [actualSubtema, setActualSubtema] = useState<Subtema | null>(null)

    const temaEdit = (subject: Subject) => {
        setActualView(TypeView.TemaEdit)
        setActualSubject(subject)
    }

    const subtemaEdit = (subtema: Subtema) => {
        setActualView(TypeView.SubtemaEdit)
        setActualSubtema(subtema)
    }

    const repeatTextTema = (texto: string) => {
        if (!texto || !subjectsData) return false // Si el texto está vacío o no hay datos, retorna falso

         const lowerCaseTexto = texto.trim().toLowerCase()
         for (const subject of subjectsData) {
             if (subject.tema.toLowerCase() === lowerCaseTexto) return true // Si se encuentra una coincidencia, retorna verdadero
         }

        return false // Si no se encontró ninguna coincidencia, retorna falso
    }

    const repeatTextSubtema = (texto: string) => {
        if (!texto || !subjectsData) return false // Si el texto está vacío o no hay datos, retorna falso
    
        const lowerCaseTexto = texto.trim().toLowerCase()
        for (const subject of subjectsData) {
            for (const subtema of subject.subtemas) {
                if (subtema.name.toLowerCase() === lowerCaseTexto) return true // Si se encuentra una coincidencia, retorna verdadero
            }
        }

        return false // Si no se encontró ninguna coincidencia, retorna falso
    }

    return (
        <div className="flex">
            <Sidebar aria-label="Sidebar with multi-level dropdown example" className='mr-2 w-auto'>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item
                            className="cursor-pointer"
                            onClick={() => { setActualView(TypeView.AddSubject) }}
                            icon={RiMenuAddLine as React.FC<React.SVGProps<SVGSVGElement>>}
                        >
                            Agregar Nuevo (Tema/Subtema)
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup>
                        {
                            subjectsData.map((subject) => (
                                <Sidebar.Collapse
                                    key={subject.id_tema}
                                    icon={FaList as React.FC<React.SVGProps<SVGSVGElement>>}
                                    label={subject.tema}
                                    renderChevronIcon={(theme, open) => {
                                        const IconComponent = open ? HiOutlineMinusSm as React.FC<React.SVGProps<SVGSVGElement>> : HiOutlinePlusSm as React.FC<React.SVGProps<SVGSVGElement>>
                                        return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />
                                    }}
                                >
                                    <Sidebar.Item
                                        icon={FaEdit as React.FC<React.SVGProps<SVGSVGElement>>}
                                        className="cursor-pointer"
                                        onClick={() => temaEdit(subject)}
                                    >
                                        {subject.tema}
                                    </Sidebar.Item>
                                    <Sidebar.Item
                                        icon={RiFolderAddFill as React.FC<React.SVGProps<SVGSVGElement>>}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            // if (!actualSubtema) {
                                            //     console.log(`no hay subtema`)
                                            //     return
                                            // }
                                            // console.log(`hay subtema`)
                                            setActualSubject(subject)
                                            setActualView(TypeView.AddSubtema)
                                        }}
                                    >
                                        Agregar Nuevo Subtema
                                    </Sidebar.Item>
                                    <hr />
                                    {
                                        subject.subtemas.map((subtema) => (
                                            <Sidebar.Item
                                                key={subtema.id_subtema}
                                                icon={CgListTree as React.FC<React.SVGProps<SVGSVGElement>>}
                                                className="cursor-pointer"
                                                onClick={() => subtemaEdit(subtema)}
                                            >
                                                {subtema.name}
                                            </Sidebar.Item>
                                        ))
                                    }
                                </Sidebar.Collapse>
                            ))
                        }
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
            <div className='container' style={{ position: 'sticky', top: '100px', height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                {actualView === TypeView.AddSubject && <AddSubject fnRepeatTema={repeatTextTema} fnRepeatSubtema={repeatTextSubtema}/>}
                {actualView === TypeView.SubtemaEdit && actualSubtema && <SubtemaEdit setActualView={setActualView} actualSubtema={actualSubtema} />}
                {actualView === TypeView.TemaEdit && actualSubject && <TemaEdit setActualView={setActualView} actualSubject={actualSubject} />}
                {actualView === TypeView.AddSubtema && actualSubject && <AddSubtema fnRepeatSubtema={repeatTextSubtema} actualSubject={actualSubject}  />}
            </div>
        </div>
    )
}