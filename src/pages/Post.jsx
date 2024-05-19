import React, { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import service from '../Appwrite/config'
import { Container } from '../components/index'
import parse from 'html-react-parser'
import noimage from '../Media/noimage.png'

function Post() {
  const [post,setPost]=useState(null)
  const navigate=useNavigate()
  const {slug}=useParams()
  const authData=useSelector(state=>state.auth.userData)

  useEffect(()=>{ // useCallback instead
    if(slug){
      service.getPost(slug)
        .then((post)=>{
          post? setPost(post): navigate('/')
        }).catch((err)=>{
          throw err
        })
    } else navigate('/')
  },[slug,navigate])

  function deletePost(){
    service.deletePost(post.$id)
      .then((status)=>{
        status? service.deleteFile(post.image):null
        navigate('/') 
      })
  }
  const isAuther= post && authData ? post.userId===authData.$id : false

  if(!post) return <div className='text-xl font-bold text-center'>Loading...</div> 

  return (
    <Container>
      <div className='border dark:border-white border-black rounded-lg w-full p-5 grid grid-cols-2'>
        <div>
        <h1 className="text-2xl ml-5 font-bold font-heading">{post.title}</h1>
        <p className=' font-content text-3xl p-5'>{post.content? parse(post.content) :''}</p>
        </div>
        <div>
        <Link to={`/fullscrn/${post.image}`}><img className='rounded-lg' src={post.image?service.getFilePreview(post.image):noimage} alt={post.title} /></Link>
        {isAuther && <>
        <Link to={`/editpost/${post.$id}`}><Button className='font-auth rounded-md dark:shadow-inner dark:shadow-green-400 shadow-inner hover:bg-green-400 shadow-green-400 bg-white dark:bg-black absolute top-20 right-32 text-green-400 border-2 border-green-500 hover:text-white dark:hover:text-white transform transition-transform duration-300 hover:scale-105 ' variant='solid'>Edit</Button></Link>
        <Button className='font-auth rounded-md absolute top-20 right-10 dark:shadow-inner shadow-inner shadow-red-400 dark:shadow-red-400 bg-white hover:bg-red-400 hover:text-white dark:bg-black border-2 text-red-400 border-red-400 dark:hover:text-white transform transition-transform duration-300 hover:scale-105 ' onClick={deletePost} variant='solid'>Delete</Button>
        </>}
        </div>
      </div>
    </Container>
  )
}

export default Post