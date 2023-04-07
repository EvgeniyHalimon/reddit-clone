import { FC } from 'react'

interface ISubmitButton{
    buttonText: string
}

const SubmitButton: FC<ISubmitButton> = ({buttonText}) => {
  return (
    <button type="submit" className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
        {buttonText}
    </button>
  )
}

export default SubmitButton