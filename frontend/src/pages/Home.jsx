import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <div id="about">
                <Hero />
            </div>
            <div id="skills">
                <Skills />
            </div>
            <div id="projects">
                <Projects />
            </div>
            <div id="contact">
                <ContactForm />
            </div>
            <Footer />
        </>
    );
}

