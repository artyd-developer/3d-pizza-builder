# Tasks

## 1. Pizza material and selection feedback

- [x] 1.1 Refine the existing raised crust shader material into a brighter golden baked rim with irregular toast and restrained char detail; verify an idle WebGL capture shows a distinct full-color rim at desktop and mobile sizes.
- [x] 1.2 Replace the current selected-quarter treatment with a smooth blinking highlight contained to the selected cheese sector, preserving the normal full-color appearance of unselected quarters; verify selection through both the canvas and the quarter controls, then verify Reset stops the pulse.

## 2. Transparent steam presentation

- [x] 2.1 Add a fixed-count transparent WebGL steam layer that rises gently above the pizza after the toppings render, remains contained around the pizza, and preserves the canvas alpha boundary; verify visible steam with no opaque rectangle or pointer obstruction at desktop and mobile sizes.
- [x] 2.2 Integrate steam GPU-resource creation, cleanup, and context restoration with the existing renderer lifecycle; verify the existing lost-context browser journey restores the rim, selected-quarter blink, and steam.

## 3. Preserve construction behavior

- [x] 3.1 Verify quarter picking, all topping placement and falling states, local cheese impacts, Undo, Clear pizza, and Reset retain their existing outcomes while presentation effects are active using the existing browser smoke command and focused visual inspection.
- [x] 3.2 Check the performance profile at desktop and mobile widths with the fixed steam layer; verify no renderer error and no material regression while the current chef, hand, and camera composition remain unchanged.
