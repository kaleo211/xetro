package com.retro.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.stereotype.Controller;

@Controller
@RequestMapping(value = "/")
public class HomeController {

	@RequestMapping(method = RequestMethod.GET)
	public String index() {
		return "index";
	}

}
