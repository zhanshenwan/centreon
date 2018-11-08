<?php
namespace CentreonRemote\Tests\Infrastructure\Export;

use PHPUnit\Framework\TestCase;
use Pimple\Container;
use CentreonRemote\ServiceProvider;
use Centreon\Test\Mock;
use CentreonRemote\Domain;
use CentreonRemote\Infrastructure\Service;

/**
 * @group CentreonRemote
 * @group ServiceProvider
 */
class ServiceProviderTest extends TestCase
{

    protected $container;
    protected $provider;

    protected function setUp()
    {
        $this->provider = new ServiceProvider();
        $this->container = new Container;
//        $this->container['realtime_db'] = new Mock\CentreonDB;
//        $this->container['configuration_db'] = new Mock\CentreonDB;
//        $this->container['centreon.db-manager'] = new \Centreon\Infrastructure\Service\CentreonDBManagerService($this->container);
        $this->container['centreon.webservice'] = $this->container['centreon.clapi'] = new class {
            public function add($class)
            {

            }
        };
        
        $this->provider->register($this->container);
    }

    /**
     * @covers \CentreonRemote\ServiceProvider::register
     */
    public function testNotifyMasterService()
    {
        $services = $this->container->keys();
        $this->assertTrue(in_array('centreon.notifymaster', $services));
        $this->assertInstanceOf(Domain\Service\NotifyMasterService::class, $this->container['centreon.notifymaster']);

        $this->assertTrue(in_array('centreon.taskservice', $services));
//        $this->assertInstanceOf(Domain\Service\TaskService::class, $this->container['centreon.taskservice']);

        $this->assertTrue(in_array('centreon_remote.export', $services));
//        $this->assertInstanceOf(Service\ExportService::class, $this->container['centreon_remote.export']);

        $this->assertTrue(in_array('centreon_remote.exporter', $services));
        $this->assertInstanceOf(Service\ExporterService::class, $this->container['centreon_remote.exporter']);

        $this->assertTrue(in_array('centreon_remote.exporter.cache', $services));
        $this->assertInstanceOf(Service\ExporterCacheService::class, $this->container['centreon_remote.exporter.cache']);
    }

    /**
     * @covers \CentreonRemote\ServiceProvider::order
     */
    public function testOrder()
    {
        $services = $this->container->keys();
        $this->assertTrue($this->provider::order() > 0);
    }
}
