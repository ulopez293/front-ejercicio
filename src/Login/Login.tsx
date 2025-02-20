import { Button, Card, Label, TextInput } from 'flowbite-react'
import { FormEvent, useState } from 'react'
import IMG from '../assets/img/icon.png'
import backgroundIMG from '../assets/img/background.jpeg'
import { useAtom } from 'jotai'
import { userDataAtom } from '../atoms/userDataAtom'

const credentials = {
  email: 'admin@foreach.com',
  password: 'Ll1820M8ZfjGHYj',
}

export const Login = () => {
  const [, setUserData] = useAtom(userDataAtom)

  const [email, setEmail] = useState(credentials.email)
  const [password, setPassword] = useState(credentials.password)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email === credentials.email && password === credentials.password) {
      setUserData({ login: true, email })
    } else {
      alert('Credenciales inválidas')
      console.error('Credenciales inválidas')
    }
  }

  return (
    <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${backgroundIMG})` }}>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm p-8">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <img src={IMG} alt="Logo" className="mx-auto" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Tu email" />
              </div>
              <TextInput id="email1" type="email" placeholder="example@foreach.com" required value={email} onChange={handleEmailChange} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Tu password" />
              </div>
              <TextInput id="password1" type="password" placeholder='********' required value={password} onChange={handlePasswordChange} />
            </div>
            <Button type="submit">Enviar</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}