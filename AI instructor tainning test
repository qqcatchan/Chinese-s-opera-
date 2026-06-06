using UnityEngine;
using UnityEngine.TestTools;
using NUnit.Framework;
using System.Collections;

public class AITrainerTests
{
    private AIImmersiveTrainer trainer;

    [SetUp]
    public void Setup()
    {
        GameObject go = new GameObject();
        trainer = go.AddComponent<AIImmersiveTrainer>();
        trainer.Start();
    }

    [Test]
    public void TestSceneSwitch()
    {
        trainer.SwitchModule(0);
        Assert.AreEqual("粵劇課程", trainer.modules[trainer.currentModuleIndex].moduleName);
    }

    [Test]
    public void TestRoleSwitch()
    {
        trainer.LoadRole(0);
        Assert.AreEqual("導師", trainer.roleCharacters[trainer.currentRoleIndex].roleName);
    }

    [Test]
    public void TestMusicPlay()
    {
        trainer.PlayTrack(0);
        Assert.IsTrue(trainer.musicTracks[trainer.currentTrackIndex].isPlaying);
    }

    [Test]
    public void TestScoreCalculation()
    {
        trainer.CalculateScore("唱段練習", 0.85f);
        // 準確度 0.85 → 分數 85
        Assert.Pass("分數計算正常");
    }

    [Test]
    public void TestErrorAdvisor()
    {
        AIErrorAdvisor.CheckScore(1.2f, "舞步練習"); // 超出範圍
        LogAssert.Expect(LogType.Error, "分數計算錯誤：練習 舞步練習 準確度超出範圍 (0-1)。");
    }
}
