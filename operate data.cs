public static class OperaData
{
    // 音樂索引
    public enum MusicTrack { WarriorTheme, ScholarTheme }
    
    // 圖片索引 (對應你的 image.png 到 image_5.png)
    public enum FaceOverlay { Ballroom, Headdress_A, Scene_Mountain, WaterSleeve, Ballroom_V2 }

    public static string GetMusicPath(MusicTrack track) => "Audio/" + track.ToString();
    public static string GetImagePath(FaceOverlay face) => "Images/" + face.ToString();
}
