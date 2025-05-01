type HeaderType = 'FormData' | 'Json'
interface Props {
  type?: HeaderType
}
export const useGetHeaders = ({ type = 'Json' }: Props) => {
  //   const { data: session } = useSession();
  if (type === 'FormData') {
    return {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      x_transfer_flag: true
    }
  } else {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      x_transfer_flag: true
    }
  }
}

// useGetHeaders
