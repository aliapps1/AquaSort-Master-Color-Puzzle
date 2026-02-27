using UnityEngine;
using UnityEngine.SceneManagement;

public class LevelSystem : MonoBehaviour
{
    public static LevelSystem Instance;
    public int currentLevel = 1;

    void Awake()
    {
        // ساخت ساختار Singleton برای دسترسی راحت از همه جای بازی
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject); // با تغییر مرحله، این فایل حذف نشود
        }
        else
        {
            Destroy(gameObject);
        }

        // بارگذاری آخرین مرحله ذخیره شده از حافظه گوشی
        currentLevel = PlayerPrefs.GetInt("SavedLevel", 1);
    }

    public void CompleteLevel()
    {
        currentLevel++;
        PlayerPrefs.SetInt("SavedLevel", currentLevel); // ذخیره در حافظه ماندگار
        PlayerPrefs.Save();
        
        LoadCurrentLevel();
    }

    public void LoadCurrentLevel()
    {
        // فرض می‌کنیم صحنه‌های بازی شما با نام Level1, Level2 و غیره ساخته شده‌اند
        string levelName = "Level" + currentLevel;
        SceneManager.LoadScene(levelName);
    }

    public void ResetProgress()
    {
        PlayerPrefs.DeleteAll();
        currentLevel = 1;
        SceneManager.LoadScene("Level1");
    }
}
