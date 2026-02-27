using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;
    public List<BottleController> allBottles = new List<BottleController>();
    private BottleController selectedBottle;
    public bool isGameFinished = false;

    void Awake() { if (Instance == null) Instance = this; }

    void Update()
    {
        if (isGameFinished) return;
        if (Input.GetMouseButtonDown(0)) HandleInput();
    }

    void HandleInput()
    {
        RaycastHit2D hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.mousePosition), Vector2.zero);
        if (hit.collider != null)
        {
            BottleController clickedBottle = hit.collider.GetComponent<BottleController>();

            if (selectedBottle == null)
            {
                if (clickedBottle.CanExtract())
                {
                    selectedBottle = clickedBottle;
                    selectedBottle.SetSelected(true); // انیمیشن بالا آمدن
                }
            }
            else
            {
                if (clickedBottle != selectedBottle && clickedBottle.CanFill(selectedBottle.GetTopColor()))
                {
                    MoveColor(selectedBottle, clickedBottle);
                }
                else
                {
                    selectedBottle.SetSelected(false); // انیمیشن پایین رفتن در صورت لغو
                    selectedBottle = null;
                }
            }
        }
    }

    void MoveColor(BottleController source, BottleController destination)
    {
        Color colorToMove = source.PopColor();
        destination.AddColor(colorToMove);
        source.SetSelected(false);
        selectedBottle = null;

        // لرزش ظریف گوشی هنگام جابجایی
        #if UNITY_ANDROID || UNITY_IOS
            Handheld.Vibrate();
        #endif

        CheckWinCondition();
    }

    void CheckWinCondition()
    {
        foreach (var bottle in allBottles)
        {
            if (!bottle.IsSolved()) return;
        }

        isGameFinished = true;
        
        // اجرای تبلیغ و رفتن به مرحله بعد
        if (AdManager.Instance != null) AdManager.Instance.ShowInterstitialAd();
        Invoke("NextLevel", 1.5f);
    }

    void NextLevel()
    {
        if (LevelSystem.Instance != null) LevelSystem.Instance.CompleteLevel();
    }
}
