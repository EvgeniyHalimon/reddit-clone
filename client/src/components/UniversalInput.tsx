import classNames from 'classnames'
import { MutableRefObject } from 'react'

interface InputGroupProps {
    className?: string
    type: string
    placeholder: string
    refs: any
    error: string | undefined
}

const UniversalInput: React.FC<InputGroupProps> = ({
    className,
    type,
    placeholder,
    refs,
    error,
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
                ref={refs}
            />
            <small className="font-medium text-red-600">{error}</small>
        </div>
    )
}

export default UniversalInput