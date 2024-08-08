import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'

function SearchBox() {
    const [keyword , setKeyword] = useState('')
    const history = useNavigate();
    let location = useLocation()

    
    const submitHandler = (e) => {
        e.preventDefault()
        
        if(keyword){
            history(`/?keyword=${keyword}`)
        }else{
            // console.log('location.pathname:',location.pathname)
            history(location.pathname)
        }

    }

    return (
        <Form onSubmit={submitHandler} className='d-flex'>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value) }
                className='mr-sm-2 ml-sm-5'
            >
            </Form.Control>

            <Button type='submit' variant='online-success' className='px-4' > <i class="fa fa-search" aria-hidden="true"></i>
            </Button>
        </Form>
    )
}

export default SearchBox
