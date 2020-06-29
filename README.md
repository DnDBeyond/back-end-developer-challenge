# DDB Back End Developer Challenge
In this test we would like you to create an API that will manage a player character’s Hit Points(HP). Clients will need to be able to do the following:
- Deal damage of different types (bludgeoning, fire, etc) while considering character resistences and immunities
- Heal
- Add temporary hit points

The Api should be built with ASP.net Core and run in docker. The service you create should calculate the HP based on the character information and persist for the life of the application. You can store the data however you'd like. You'll find the json that represents a stripped down character in  [briv.json](briv.json).

HP are an abstract representation of a character's life total. In D&D a character's HP are calculated in one of two ways. Either a random roll of a Hit Die whose number of sides is determined by a character's class for each class level they have, or the player may choose to the rounded up average result of the hit die value for each character level. You may choose either method you do not need to do both. Also included in the calculation of the character's HP is the character's constitution stat modifer. To calculate a stat modifier take the ((statValue - 10)/2) round to the lowest integer. In negative numbers this means rounding to the integer further from zero.

Temporary Hit Points are a special case of hitpoints that are added to the HP total and are always subtracted from first, and they cannot be healed. Temporary hit points are never additive they only take the higher value what exists or what is being "added".

When a character has resistance to a damage type they receive half damage from that type.

When a character has immunity to a damage type they receive no damage from that type.

If you have questions please reach out. 
