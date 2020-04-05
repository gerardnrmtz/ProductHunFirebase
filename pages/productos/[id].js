import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layouts/Layout";
import { FirebaseContext } from "../../firebase";
import Error404 from "../../components/layouts/404";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";
const H1titulo = styled.h1`
  text-align: center;
  margin-top: 5rem;
`;
const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const H2Comentario = styled.h2`
  margin: 2rem 0;
`;
const DivVotos = styled.div`
  margin-top: 5rem;
`;
const PVotos = styled.p`
  text-align: center;
`;
const LiStyled = styled.li`
  border: 1px solid #e1e1e1;
  padding: 2rem;
`;
const SpanComentarioUsuario = styled.span`
  font-weight: bold;
`;
const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;
const Producto = () => {
  //Sate componente
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarConsultarBD] = useState(true);

  const router = useRouter();
  const {
    query: { id },
  } = router;
  //const de firebase
  const { firebase, usuario } = useContext(FirebaseContext);
  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          guardarProducto(producto.data());
          guardarConsultarBD(false);
        } else {
          guardarError(true);
          guardarConsultarBD(false);
        }
      };
      obtenerProducto();
    }
  }, [id, consultarDB]);
  if (Object.keys(producto).length === 0 && !error) return "cargando";
  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    havotado,
  } = producto;
  const onClick = () => {
    if (!usuario) {
      return router.push("/login");
    }
    //obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;
    //si ha votado
    if (havotado.includes(usuario.uid)) return;
    //guardar del id del usuario que ha votado
    const hanVotado = [...havotado, usuario.uid];
    //actualizar BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, havotado: hanVotado });
    //actualizar el state

    guardarProducto({
      ...producto,
      votos: nuevoTotal,
    });
    guardarConsultarBD(true);
  };
  //funciones para comentarios
  const comentariochange = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };
  //Identifica si es el creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };
  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;
    //tomar copia y agregarlos ala arreglo
    const nuevosComentarios = [...comentarios, comentario];
    //Actualiar BD
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevosComentarios,
    });
    //Acualizar state
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
    e.target.reset();
    guardarConsultarBD(true);
  };
  //funcion que revisa que el creado del producto
  const puedeBorrar = () => {
    if (!usuario) return false;
    if (creador.id === usuario.uid) return true;
  };
  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    if (creador.id !== usuario.uid) {
      return router.push("/");
    }
    try {
      await firebase.db.collection("productos").doc(id).delete();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="contenedor">
            <H1titulo>{nombre}</H1titulo>
            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por {creador.nombre} de {empresa}
                </p>
                <img src={urlimagen} />
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentariochange}
                        />
                      </Campo>
                      <InputSubmit
                        type="submit"
                        value="Agregar comentario"
                      ></InputSubmit>
                    </form>
                  </>
                )}

                <H2Comentario>Comentarios</H2Comentario>
                {comentarios.length === 0 ? (
                  "Aun no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <LiStyled key={`${comentario.usuarioId}-${i}`}>
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por :
                          <SpanComentarioUsuario>
                            {comentario.usuarioNombre}
                          </SpanComentarioUsuario>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>
                            Creador del producto
                          </CreadorProducto>
                        )}
                      </LiStyled>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Boton target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <DivVotos>
                  <PVotos>{votos} Votos</PVotos>
                  {usuario && <Boton onClick={onClick}>Votar</Boton>}
                </DivVotos>
              </aside>
              {puedeBorrar() && (
                <Boton onClick={eliminarProducto}>Eliminar producto</Boton>
              )}
            </ContenedorProducto>
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
