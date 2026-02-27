using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;
    public List<BottleController> allBottles = new List<BottleController>();
    
    private BottleController selectedBottle;

    void Awake() { Instance = this; }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            HandleInput();
        }
    }

    void HandleInput()
    {
        RaycastHit2D hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.mousePosition), Vector2.zero);
        if (hit.collider != null)
        {
            BottleController clickedBottle = hit.collider.GetComponent<BottleController>();

            if (selectedBottle == null)
            {
                if (clickedBottle.CanExtract()) selectedBottle = clickedBottle;
            }
            else
            {
                if (clickedBottle != selectedBottle && clickedBottle.CanFill(selectedBottle.layers[selectedBottle.layers.Count-1]))
                {
                    // انتقال رنگ
                    Color colorToMove = selectedBottle.PopColor();
                    clickedBottle.AddColor(colorToMove);
                    CheckWinCondition();
                }
                selectedBottle = null;
            }
        }
    }

    void CheckWinCondition()
    {
        foreach (var bottle in allBottles)
        {
            if (!bottle.IsSolved()) return;
        }
        Debug.Log("You Won! Loading Next Level...");
        // کد رفتن به مرحله بعد
    }
}
