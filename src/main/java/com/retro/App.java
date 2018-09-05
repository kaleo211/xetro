package com.retro;

import com.retro.configuration.SpringApplicationContextInitializer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class App {
	public static void main(String[] args) {
		new SpringApplicationBuilder(App.class).initializers(new SpringApplicationContextInitializer()).application()
				.run(args);
	}
}
