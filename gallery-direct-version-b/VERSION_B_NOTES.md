# Gallery Direct — Version B for Nigel

Created as a separate copy of Version A (source commit 699b83674055a5239b1ab2974b7a884181e416d2). Version A was not edited or republished.

## Navigation

Art, Mirrors, Clocks and Cards have their own top-level desktop and mobile links. Existing department links, menu styling and subcategory destinations are preserved. Art, Mirrors and Clocks no longer appear under Wall Decor in the main navigation or product breadcrumbs.

## Filters

The four departments follow the requested primary/secondary ordering. Filters remain collapsible and use the existing sidebar and mobile drawer. Unsupported categorical facets and values are hidden. Width/height controls use exact millimetres; unavailable measurements are disabled rather than invented. Price is exposed only when an explicit trade price is supplied.

- Art uses Subject, Style, Orientation, Colour, Width, Height, Presentation and Availability, followed by supported secondary attributes. Panoramic is normalised to Panoramic / Long. Presentation uses the supplied source product type. Framed Art remains Framed Art because glazing is not confirmed.
- Mirrors separates Type, Shape, dimensions, Colour, Style and Availability from supported frame, finish and mounting attributes. Existing Rectangular values map to Rectangle. Cheval is derived only from an explicit product name. Generic Mirror is not guessed to mean Wall Mirror.
- Clocks separates Type, exact Size / Diameter, Colour, Style and Availability from supported dial, face, material, room, movement and feature attributes. Existing Thomas Kent size bands remain supplementary. Cuckoo and Oversized routes include matching clock records.
- Cards uses Occasion, genuine Collection, Recipient, Pack Size and Availability before the supported secondary filters. Generic New Season sample collections are not represented as genuine Artbeat ranges.

## Current sample-data limitations

The existing Art sample has no confirmed style, colour, orientation or frame attributes. Ambiguous dimension strings are retained on product details, without guessing width/height axes. Most mirror dimensions beyond explicit round diameters remain unconfirmed. The Thomas Kent sample has size bands but no exact diameters or verified Gallery availability. The Artbeat sample has no verified collection names, formats or artist/designer attributes. These gaps are preserved and the corresponding categorical filters remain hidden.

## Validation

Validated department routing, primary/secondary order, conditional attribute handling, inclusive dimensional bounds, supported values and assets. CSS files, product records, images and unrelated department filter modules are identical to Version A. Shared page navigation consistently exposes the four standalone departments. No browser visual verification was performed.
