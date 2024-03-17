import { useState, useEffect, useCallback, memo} from 'react'

const Temp = () => {
  const [name, setName] = useState<string>('')
  const [address, setAddress] = useState<string>('')
 
  return (
    <>
      <label>
        Name:
        <input value={name} onChange={e => setName(e.target.value)}></input>
      </label>
      <label>
        Address:
        <input value={address} onChange={e => setAddress(e.target.value)}></input>
      </label>
      <Greeting name={name} />
    </>
  )
}

const Greeting = memo(function Greeting({ name }: { name: string }) {
  console.log("rendered")
  const [greeting, setGreeting] = useState<string>('')
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  )
})

const GreetingSelector = ({ value, onChange }: {value: string, onChange: (val: string) => void}) => {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}

export default Temp