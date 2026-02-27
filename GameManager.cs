using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    [Header("Game Settings")]
    public List<BottleController> allBottles = new List<BottleController>();
    private BottleController selectedBottle;

    [Header("Status")]
    public bool isGameFinished = false;

    void Awake()
    {
        if (Instance == null) Instance = this;
    }

    void Update()
    {
        if (isGameFinished) return;

        // مدیریت لمس صفحه در موبایل و کلیک موس در کامپیوتر
        if (Input.GetMouseButtonDown(0))
        {
            HandleInput();
        }
    }

    void HandleInput()
    {
        // تشخیص بطری لمس شده
        RaycastHit2D hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.mousePosition), Vector2.zero);
        
        if (hit.collider != null)
        {
            BottleController clickedBottle = hit.collider.GetComponent<BottleController>();

            if (selectedBottle == null)
            {
                // انتخاب بطری اول
                if (clickedBottle.CanExtract())
                {
                    selectedBottle = clickedBottle;
                    // اینجا می‌توان یک انیمیشن کوچک برای بالا آمدن بطری اضافه کرد
                }
            }
            else
            {
                // انتخاب بطری دوم برای ریختن آب
                if (clickedBottle != selectedBottle && clickedBottle.CanFill(selectedBottle.GetTopColor()))
                {
                    MoveColor(selectedBottle, clickedBottle);
                }
                else
                {
                    selectedBottle = null; // لغو انتخاب اگر انتقال ممکن نباشد
                }
            }
        }
    }

    void MoveColor(BottleController source, BottleController destination)
    {
        Color colorToMove = source.PopColor();
        destination.AddColor(colorToMove);
        selectedBottle = null;

        CheckWinCondition();
    }

    void CheckWinCondition()
    {
        foreach (var bottle in allBottles)
        {
            if (!bottle.IsSolved()) return;
        }

        // --- بخش هماهنگ سازی شده با سایر فایل‌ها ---
        isGameFinished = true;
        Debug.Log("مرحله با موفقیت تمام شد!");

        // ۱. نمایش تبلیغ برای درآمدزایی
        if (AdManager.Instance != null) 
            AdManager.Instance.ShowInterstitialAd();

        // ۲. رفتن به مرحله بعد و ذخیره سازی
        if (LevelSystem.Instance != null)
            Invoke("NextLevel", 2f); // ۲ ثانیه تاخیر برای حس پیروزی کاربر
    }

    void NextLevel()
    {
        LevelSystem.Instance.CompleteLevel();
    }
}
