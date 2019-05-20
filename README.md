# Elefind

Content finder will find every place of your choice in selected book and provide you list of links to places where your selector occures.

http://content-finder.herokuapp.com/

Backend: https://github.com/PiotrKozlowski/elefind-go

## How to search for custom elements

To target specific elements in book we use css selectors. Detailed article about them - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors

## Additional selectors:

Search for tables with images: **table:has(img)**

Search for tables inside Solution containers: **.os-solution-container:has(table)**

Search for .howto elements which contains "Step" text: **.howto:hasText(Step)**
