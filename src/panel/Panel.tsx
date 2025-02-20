import { Tabs } from 'flowbite-react'
import { FaUsers } from "react-icons/fa"
import { MdCategory } from "react-icons/md"
import { TableUsers } from './components/TableUsers/TableUsers'
import { ModalSubjects } from './components/Modal/ModalSubjects'
import { useState } from 'react'
import { User } from '../interfaces/User'
import { Subject } from '../interfaces/Subject'
import useSWR from 'swr'
import { Catalogo } from './components/Catalogo/Catalogo'
//import { SearchBar } from '../components/SearchBar/SearchBar'


const fetcherUsers = async (url: string) => {
    const response = await fetch(url)
    const data = await response.json() as User[]
    return data
}

const fetcherSubjects = async (url: string) => {
    const response = await fetch(url)
    const data = await response.json() as Subject[]
    return data
}


export const Panel = () => {
    const usersSWR = useSWR<User[], Error>(`${import.meta.env.VITE_URL_USERS_API}/users/ALL`, fetcherUsers)
    const subjectsSWR = useSWR<Subject[], Error>(`${import.meta.env.VITE_URL_SUBJECTS_API}/subjects`, fetcherSubjects)
    const [dataModal, setOpenModal] = useState({
        type: ``,
        isOpen: false,
        id_user: 0
    })

    if (subjectsSWR.error ?? usersSWR.error) return <h1>failed to load</h1>
    if (usersSWR.isLoading || subjectsSWR.isLoading) return <h1>loading...</h1>

    return (
        <>
            <Tabs aria-label="Default tabs" style="default">
                <Tabs.Item active title="Usuarios (Subtemas)" icon={FaUsers as React.FC<React.SVGProps<SVGSVGElement>>}>
                    {usersSWR.data && subjectsSWR.data ? <TableUsers usersData={usersSWR.data} subjectsData={subjectsSWR.data} setOpenModal={setOpenModal} /> : null}
                    {usersSWR.data && subjectsSWR.data ? <ModalSubjects usersData={usersSWR.data} subjectsData={subjectsSWR.data} dataModal={dataModal} setOpenModal={setOpenModal} /> : null}
                </Tabs.Item>
                <Tabs.Item className='inline-block' title="Catálogo (Temas / Subtemas)" icon={MdCategory as React.FC<React.SVGProps<SVGSVGElement>>}>
                    {subjectsSWR.data ? <Catalogo subjectsData={subjectsSWR.data} /> : null}
                </Tabs.Item>
            </Tabs>
        </>
    )
}