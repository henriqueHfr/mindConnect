package br.com.hpg.app_faculdade.adapters.inbound.rest.v1.cadastro

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/v1/cadastro")
class CadastroRest {

    fun cadastrar(): ResponseEntity<String> {
        return ResponseEntity.ok("Cadastro realizado com sucesso!")
    }

}