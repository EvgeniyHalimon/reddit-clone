import classNames from 'classnames'
import ErrorMessage from './ErrorMessage'
import { memo } from 'react'

interface InputGroupProps {
    className: string,
    id: string, 
    name: string, 
    placeholder: string
    type: 'text' | 'email' | 'password' 
    onChange: any
    value: string
    error: undefined | boolean,
    helperText: string | undefined | boolean,
}

const UniversalInput: React.FC<InputGroupProps> = ({
    className,
    id, 
    name,
    placeholder,
    type,
    onChange,
    value,
    error,
    helperText 
    }) => {
    return (
        <div className={className}>
            <input 
              id={id} 
              name={name} 
              placeholder={placeholder}
              type={type} 
              onChange={onChange} 
              value={value} 
              className={classNames(
                'w-full p-3 mb-1 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
                { 'border-red-500': error && helperText }
                )}
            />
            {error && helperText && (
            <div className="text-rose-700">{helperText}</div>
            )}
        </div>
    )
}

export default memo(UniversalInput)

/* import classNames from 'classnames'
import ErrorMessage from './ErrorMessage'
import { memo } from 'react'

interface InputGroupProps {
    id: string,
    name: string,
    className?: string
    type: string
    placeholder: string
    value: string
    error: string | undefined
    onChange: any
}

const UniversalInput: React.FC<InputGroupProps> = ({
    id,
    name,
    className,
    type,
    placeholder,
    value,
    error,
    onChange
    }) => {
    return (
        <div className={className}>
            <input
                id={id}
                name={name}
                type={type}
                className={classNames(
                'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
                { 'border-red-500': error }
                )}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
           <ErrorMessage error={error}/>
        </div>
    )
}

export default memo(UniversalInput) */