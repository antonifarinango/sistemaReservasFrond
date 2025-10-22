import React from "react";

import '../styles/Inicio.css'

//IMAGENES
import logo from '../assets/inicio/logo-restaurante.jpg'


import { Link } from "react-router-dom";

export default function Inicio() {
    return (
        <div className="" style={{ backgroundColor: "#ffffffff" }}>
            <div className="container min-vh-100 d-flex flex-column">
                <header className="d-flex py-1 justify-content-around">
                    <div className="icons-header col-3 d-flex justify-content-center align-items-center">
                        <img src={logo} className="logo-header" />
                    </div>

                    <div className="data-header col-9">
                        <div className="h-50 d-flex justify-content-end align-items-center px-3 fw-bold me-2">0898766574</div>
                        <ul className="d-flex align-items-center h-50 justify-content-end px-3 gap-4 list-unstyled mb-0"
                            style={{ borderTop: "4px solid #000000ff" }}>
                            <li className="">
                                <a className="text-dark text-decoration-none fw-bold" href="#hero-section">Inicio</a>
                            </li>
                            <li className="">
                                <a className="text-dark text-decoration-none fw-bold" href="#about">sobre Nosotros</a>
                            </li>
                            <li className="">
                                <Link className="btn-reserva-fotos fw-bold rounded-1 btn text-decoration-none" to="/reserva">Reservar</Link>
                            </li>
                        </ul>
                    </div>
                </header>

                <main className="flex-grow-1">
                    <section id="hero-section" className="hero-section text-light py-5 d-flex justify-content-center align-items-center">
                        <div className="mascara-hero"></div>
                        <div className="texto-hero col-lg-7 h-75">
                            <div className="h-25 d-flex align-items-center justify-content-center">
                                <h1 className="fs-4 fw-bold">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h1>
                            </div>
                            <div className="h-50 fw-semibold d-flex align-items-center">
                                <p className="text-center fs-2">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, ab harum. Quisquam recusandae tempore veniam fuga. Ad repudiandae.
                                </p>
                            </div>
                            <div className=" d-flex justify-content-center h-25 align-items-center">
                                <Link className="btn btn-reserva p-3 px-5 rounded-1 text-decoration-none" to="/reserva">Reserva con nosotros</Link>
                            </div>
                        </div>
                    </section>
                    <section id="about" className="about-section d-flex">
                        <div className="col-6 px-3 d-flex flex-column justify-content-center">
                            <div className="h-25 d-flex flex-column justify-content-end gap-2">
                                <div className="fw-semibold fs-5">
                                    <p className="mb-0">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                                </div>
                                <div className="fw-bold">
                                    <p className="fs-4 mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia repellendus dignissimos molestiae</p>
                                </div>
                            </div>
                            <hr className="w-75 mt-4" />
                            <div className="h-75">
                                <p className="mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum quaerat fugiat veritatis rerum, explicabo ipsam illo excepturi odio ut? Libero praesentium tempore esse, mollitia quo perferendis inventore velit odio dolore.
                                    Architecto impedit numquam adipisci, voluptates nulla ullam sunt repellat optio. Labore quam autem neque vero vel dolorem quod veritatis doloribus laboriosam quae maiores iure doloremque nobis, odio explicabo eveniet vitae?
                                    Magni ex sunt maxime saepe, alias harum, dolore qui perspiciatis quidem nobis distinctio labore praesentium laudantium laboriosam nam vero porro dolorum at error quisquam sequi soluta. Delectus debitis sapiente corporis?
                                    Minima ratione reiciendis nisi exercitationem consequuntur, iusto officia nostrum nihil facilis ullam magni modi laboriosam corrupti impedit ipsa id reprehenderit dolore. Eum ullam laudantium, corrupti ratione odio deleniti reprehenderit eligendi!
                                    Est, doloribus repudiandae nesciunt harum autem, a placeat adipisci nostrum, id quo labore natus inventore nulla officiis odio. Deserunt fuga eveniet suscipit eaque nam accusantium! Amet tenetur placeat natus doloribus!</p>
                            </div>
                        </div>
                        <div className="about-img col-6">

                        </div>
                    </section>
                    <section className="fotos-section flex-column py-5 d-flex justify-content-center align-items-center gap-4">

                        <div className="w-100 d-flex justify-content-center gap-2">
                            <div className="card-inicio-1 rounded-1">
                            </div>
                            <div className="card-inicio-2 rounded-1">
                            </div>
                            <div className="card-inicio-3 rounded-1">
                            </div>

                        </div>

                        <div className="w-100 d-flex h-25 justify-content-center">
                            <Link className="btn-reserva-fotos btn w-25 rounded-1  py-2 text-decoration-none" to="/reserva">Buscar Mesa</Link>
                        </div>
                    </section>

                    <section className="hero2-section d-flex align-items-center">
                        <div className="hero-2-img w-100" style={{ height: "400px" }}>
                            d
                        </div>
                        <div className="dv-absolute-hero2 rounded-1 d-flex flex-column p-5 gap-1">
                            <div className="h-25 d-flex flex-column justify-content-between">
                                <p className="mb-0">Lorem, ipsum dolor sit</p>
                                <p className="fs-5  mb-0 fw-bold">Lorem, ipsum dolor sit amet consectetur</p>
                            </div>
                            <div className="h-50 d-flex align-items-center">
                                <p className="mb-0 text-start">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit adipisci pariatur fuga eveniet numquam quae officiis repellendus voluptates similique ratione commodi, consequatur omnis voluptatum ex! Nulla dolorum dolor nihil! Pariatur.</p>
                            </div>
                            <div className="h-25 d-flex align-items-center">
                                <div className="w-100 h-50  d-flex justify-content-center">

                                    <Link className="btn btn-reserva w-50 rounded-1 text-decoration-none" to="/reserva">Buscar Mesa</Link>

                                </div>

                            </div>
                        </div>
                    </section>
                </main>

                <footer className="d-flex">
                    <div className=" px-3  container-footer">
                        <p>Lorem ipsum dolor</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque rerum voluptatibus, deserunt amet itaque quas delectus iste veniam fugiat possimus vero distinctio dolorum, doloremque, fuga necessitatibus! Quibusdam magni ex voluptates.</p>

                        <p>Lorem ipsum dolor sit amet consectetur</p>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                    </div>
                    <div className=" container-footer d-flex align-items-center justify-content-center">
                        <div className="d-flex h-75 align-items-center gap-2 justify-content-center">
                            <div className=" h-75 d-flex flex-column justify-content-between">
                                <div className="redes-footer">
                                </div>
                                <div className="redes-footer">
                                </div>
                                <div className="redes-footer">
                                </div>
                            </div>
                            <div className=" h-75 d-flex flex-column justify-content-between">
                                <p className="mt-2">Loremipsum</p>
                                <p>Loremipsum</p>
                                <p>Loremipsum</p>
                            </div>
                        </div>

                    </div>
                    <div className="container-footer d-flex justify-content-center align-items-center">
                        <img src={logo} className="logo-footer" />
                    </div>
                </footer>
            </div>
        </div>

    );



}