import React, { useState,useContext } from "react";
import Router,{useRouter} from "next/router";
import FileUploader from 'react-firebase-file-uploader';
import Layout from "../components/layouts/Layout";
import Error404 from '../components/layouts/404';
import {
  Formulario,
  Campo,
  InputSubmit,
  Error
} from "../components/ui/Formulario";

import {FirebaseContext} from "../firebase";
import styled from "@emotion/styled";
//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import { route } from "next/dist/next-server/server/router";

const H1styled = styled.h1`
  text-align:center;
  margin-top:5;rem;
`;
const STATE_INICIAL = {
  nombre: "",
  empresa:'',
  imagen:'',
  url:'',
  descripcion:''
};

const NuevoProducto = () => {
  //State de las iamgenes
  const [nombreImagen,guardarNombre]=useState('');
  const [subiendo,guardarSubiendo]=useState(false);
  const [progreso,guardarProgreso]=useState(0);
  const [urlimagen,guardarUrlImagen]=useState('');



  const [error, guardarError] = useState(false);
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handeBlur
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa,imagen,url,descripcion } = valores;
  //Hook de routing para redicreionar
  const router=useRouter();
//Context con crud de firebase
  const {usuario,firebase}=useContext(FirebaseContext);
  async function crearProducto() {
    //si el usuario no esta auth llevar al login
    if(!usuario){
      return router.push('/login');
    }
    //Crear nuevo objeto producto
    const producto={
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos:0,
      comentarios:[],
      creado:Date.now(),
      creador:{
        id:usuario.uid,
        nombre:usuario.displayName
      },
      havotado:[]
    }
    //insertar en la bd
    firebase.db.collection('productos').add(producto);
    return router.push('/');
  }
  //Imagenes

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
}

const handleProgress = progreso => guardarProgreso({ progreso });

const handleUploadError = error => {
    guardarSubiendo(error);
    console.error(error);
};

const handleUploadSuccess = nombre => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre)
    firebase
        .storage
        .ref("productos")
        .child(nombre)
        .getDownloadURL()
        .then(url => {
          guardarUrlImagen(url);
        } );
};
  return (
    <div>
      <Layout>
        {!usuario?<Error404></Error404>:(<>
          <H1styled>Nuevo producto</H1styled>
          <Formulario onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Informacion general</legend>
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handeBlur}
                />
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}
              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="empresa"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handeBlur}
                />
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}
              <Campo>
                <label htmlFor="imagen">Imagen</label>
                <FileUploader
                accept="image/*"
                  id="imagen"
                  name="imagen"
                  randomizeFilename
                  storageRef={firebase.storage.ref("productos")}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}

                />
              </Campo>
              <Campo>
                <label htmlFor="url">ULR</label>
                <input
                  type="url"
                  id="url"
                  placeholder="url de tu producto"
                  name="url"
                  value={url}
                  onChange={handleChange}
                  onBlur={handeBlur}
                />
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>
            <fieldset>
              <legend>Sobre tu Producto</legend>
              <Campo>
                <label htmlFor="descripcion">Descripcion</label>
                <textarea
                  id="descripcion"
                  placeholder="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handeBlur}
                />
              </Campo>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>

            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Crear producto" />
          </Formulario>
        </>)}
        
      </Layout>
    </div>
  );
};
export default NuevoProducto;
