import classNames from 'classnames'
import ErrorMessage from './ErrorMessage'
import { memo } from 'react'

interface InputGroupProps {
    className?: string
    type: string
    placeholder: string
    value: string
    error: string | undefined
    setValue: (str: string) => void
}

const UniversalInput: React.FC<InputGroupProps> = ({
    className,
    type,
    placeholder,
    value,
    error,
    setValue
    }) => {
    return (
        <div className={className}>
            <input
                type={type}
                className={classNames(
                'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
                { 'border-red-500': error }
                )}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
           <ErrorMessage error={error}/>
        </div>
    )
}

export default memo(UniversalInput)