# 📖 Chocobaddie - Detailed Gameplay Guide

## Story & Setting

**Erlin** is a 22-year-old explorer and trekker who experiences the thrill of an unexpected skydive jump over a mysterious archipelago. After the jump, she finds herself on the first island with nothing but her survival instincts.

The game takes place in **third-person perspective**, showing Erlin's journey through five different islands, each progressively more challenging. Her goal: survive by hunting, managing resources, and finding a way to escape each island after three days.

## Game Progression

### Island Progression
The game spans **5 islands**, each requiring 3 days of survival:

1. **Island 1** - The starting island, calm and beginner-friendly
2. **Island 2** - Moderate difficulty with varied wildlife
3. **Island 3** - Challenging terrain with stronger animals
4. **Island 4** - Advanced hunting and survival required
5. **Island 5** - Final island leading to escape and victory

### Daily Progression
Each island follows the same pattern:
- **Day 1-2:** Standard survival (explore, hunt, eat)
- **Day 3:** Boat becomes available at island edge
- **At Boat:** Automatic transition to next island

## Survival Systems

### Health System
```
Health: 0-100
- Decreases when hunger drops below 20
- Damaged by animal attacks (5-20 per hit)
- Game Over if health reaches 0
```

### Hunger System
```
Hunger: 0-100
- Decreases naturally (0.02 per frame while active)
- Faster reduction during movement
- Critical below 20 (damages health)
- Restored by eating meat (+30 per meat item)
```

### Energy System
```
Energy: 0-100
- Decreases during movement and combat
- Recovered when standing still (0.01 per frame)
- Required for jumping (costs 10)
- Required for attacking (costs 5)
```

## Combat System

### Attacking
- **Range:** 5 units in front of camera
- **Damage:** 20 per hit
- **Cooldown:** 0.5 seconds between attacks
- **Cost:** 5 energy per attack
- **Method:** Click to attack in aiming direction

### Enemy Types

#### Boar 🐗
- **Health:** 50
- **Speed:** Medium
- **Threat:** Moderate
- **Meat Value:** 2-5 pieces
- **Color:** Brown
- **Behavior:** Charges when threatened

#### Deer 🦌
- **Health:** 40
- **Speed:** Fast
- **Threat:** Low (avoids combat)
- **Meat Value:** 3-6 pieces
- **Color:** Tan
- **Behavior:** Flees on sight

#### Wolf 🐺
- **Health:** 60
- **Speed:** Fast
- **Threat:** High
- **Meat Value:** 4-7 pieces
- **Color:** Gray
- **Behavior:** Hunts in packs

## Item System

### Collectible Items
All meat types can be collected after defeating animals:
- `boar_meat` - Common, restores 30 hunger
- `deer_meat` - Common, restores 30 hunger
- `wolf_meat` - Rare, restores 30 hunger

### Using Items
Click items in inventory to consume them:
- Restores 30 hunger points
- Consumed immediately
- Removed from inventory

## Navigation & Movement

### First-Person Camera Control
- **Mouse Movement:** Full 360° view rotation
- **Vertical Rotation:** Limited to prevent flipping (-90° to +90°)
- **Horizontal Rotation:** Full 360° rotation
- **Sensitivity:** 0.002 (adjustable)

### Movement Mechanics
- **Speed:** 0.3 units per frame (adjustable)
- **Head Bob:** Natural walking animation
- **Friction:** Movement slows with friction applied
- **Jump Height:** Proportional to jump force (0.6)

### Island Boundaries
- Islands are circular with ~250 unit radius
- Player cannot move beyond island edges
- Ocean surrounds all islands
- Animals also confined to island

## Environmental Design

### Terrain Features
- **Ground:** Green grass surface (island interior)
- **Ocean:** Blue water surrounding islands
- **Forest:** ~30% tree coverage per island
- **Trees:** Vary in placement for natural feel

### Day/Night Cycle
- **Game Time:** Progresses 0.01 minutes per frame
- **Full Day:** 24 in-game hours
- **Starting Time:** 6:00 AM
- **Time Display:** Updated in HUD

## User Interface

### HUD Elements

#### Stats Panel (Top-Left)
- **Health Bar:** Red gradient (current/max)
- **Hunger Bar:** Orange gradient (current/max)
- **Energy Bar:** Green gradient (current/max)

#### Time Display (Top-Right)
- **Current Day:** "Day X"
- **Current Time:** "HH:MM" format

#### Inventory Panel (Bottom-Right)
- **Grid Layout:** 3 columns
- **Click to Use:** Consume food items
- **Shows Quantity:** Item count displayed

#### Control Instructions (Bottom-Left)
- Movement keys: W/A/S/D
- Jump: SPACE
- Look: MOUSE
- Attack: LEFT CLICK

#### Messages (Center)
- Temporary notifications
- Hunt results
- Island transitions
- Game events

## Strategies & Tips

### Survival Strategy
1. **Early Exploration:** Map out the island and find animals
2. **Hunting Pattern:** Hunt regularly to maintain food supply
3. **Energy Management:** Rest between intense activities
4. **Health Maintenance:** Keep hunger above 30 to prevent health drain

### Combat Tips
1. **One at a Time:** Focus on single enemies
2. **Ranged Approach:** Keep distance and circle enemies
3. **Energy Conservation:** Don't spam attacks
4. **Retreat:** Run away if outnumbered

### Food Management
1. **Stock Pile:** Hunt early and often
2. **Portion Control:** Don't waste meat on full hunger
3. **Animal Priority:** Hunt deer first (easiest), then boars, avoid wolves initially
4. **Emergency Food:** Keep at least 3-5 meat items in inventory

### Navigation
1. **Use Trees:** Use forest density for navigation landmarks
2. **Find Boat:** Search island edges after Day 3
3. **Safe Zones:** Stay near start point if low on health
4. **Perimeter Check:** Circle island to find boat location

## Game Over Conditions

### Loss Conditions
- **Health Reaches 0:** Starvation or combat damage
- Game Over Screen displays:
  - Reason for failure
  - Days survived
  - Islands reached
  - Items collected

### Victory Condition
- **Reach Island 5 and find boat:** Complete all islands
- Victory Screen displays:
  - Total days survived
  - Journey completion stats
  - Islands conquered

## Performance Notes

### Optimization Features
- Fog rendering limits draw distance
- Efficient mesh pooling for animals
- Shadow mapping for realistic lighting
- WebGL hardware acceleration

### Recommended Settings
- **Screen Resolution:** 1920x1080 or higher
- **Frame Rate:** 60 FPS target
- **Draw Distance:** ~1000 units
- **Browser:** Chrome/Firefox with WebGL 2.0

## Difficulty Progression

### Island 1 (Easy)
- Lower animal density
- Weaker animals (more deer)
- Abundant resources
- Learning phase

### Island 2 (Normal)
- Standard animal density
- Mixed animal types
- Balanced resources
- Core gameplay

### Island 3 (Hard)
- Higher animal density
- More aggressive animals
- Limited resources
- Skill challenge

### Island 4 (Very Hard)
- Dense wildlife
- Mostly predators (wolves)
- Scarce food
- Endurance test

### Island 5 (Expert)
- Maximum difficulty
- Mostly wolves
- Limited resources
- Final challenge
- Victory upon completion

---

**Good luck, Erlin! Survive the islands and complete your adventure!** 🏝️✨
