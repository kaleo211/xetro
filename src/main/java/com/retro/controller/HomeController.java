package com.retro.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequestMapping(value = "/")
public class HomeController {
	@GetMapping
	public String index() {
		return "index";
	}
}
