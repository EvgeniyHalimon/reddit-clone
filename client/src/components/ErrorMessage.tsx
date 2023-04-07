import React, { FC } from 'react'

interface IErrorMessage{
    error: string | undefined
}

const ErrorMessage: FC<IErrorMessage> = ({error}) => {
  return (
    <small className="font-medium text-red-600">{error}</small>
  )
}

export default ErrorMessage