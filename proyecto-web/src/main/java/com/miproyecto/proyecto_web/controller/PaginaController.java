package com.miproyecto.proyecto_web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginaController {

    @GetMapping
    public String mostrarInicio(){
        return "index";
    }
}
