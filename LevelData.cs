using UnityEngine;
using System.Collections.Generic;

[System.Serializable]
public class LevelData
{
    public int levelNumber;
    public List<BottleSetup> bottles;
}

[System.Serializable]
public class BottleSetup
{
    public List<Color> initialColors; // رنگ‌هایی که در شروع مرحله در این بطری هستند
}

// این یک اسکریپت برای ساخت فایل‌های مرحله در یونیتی است
[CreateAssetMenu(fileName = "NewLevel", menuName = "AquaSort/Level")]
public class LevelScriptableObject : ScriptableObject
{
    public LevelData data;
}
