package com.apoorva.restaurant.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.service.AiService;

@Service
public class AiServiceImpl implements AiService {

    private final MenuItemRepository menuItemRepository;
    private final ChatClient chatClient;

    public AiServiceImpl(MenuItemRepository menuItemRepository, ChatClient.Builder chatClientBuilder) {
        this.menuItemRepository = menuItemRepository;
        this.chatClient = chatClientBuilder.build();
    }

    @Override
    public String getMenuRecommendation(String customerQuery) {
        List<MenuItem> menuItems = menuItemRepository.findAll();

        if (menuItems.isEmpty()) {
            return "Our kitchen is currently updating the menu. Please check back in a moment!";
        }

        String menuContext = menuItems.stream()
                .map(item -> String.format("- %s (%s): ₹%.2f | %s",
                        item.getItemName(),
                        item.getCategory(),
                        item.getPrice(),
                        item.getDescription()))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
                You are an expert AI Waiter at Apoorva Restaurant.
                Use the following menu to help the user:
                %s
                
                Guidelines:
                - Suggest specific dishes based on user preference.
                - Mention the price in Rupees.
                - If the user is vague, suggest our bestsellers.
                """.formatted(menuContext);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(customerQuery)
                .call()
                .content();
    
    }

	@Override
	public String chat(String message) {
		// TODO Auto-generated method stub
		return null;
	}

}
